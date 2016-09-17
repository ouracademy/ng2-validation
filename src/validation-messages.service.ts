import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageBag } from './message-bag';
import { ValidationMessagesLoader } from './validation-messages-loader.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class ValidationMessagesService {
    private form: FormGroup;
    private errors: MessageBag;
    private validationMessagesRules: ValidationMessagesRules;

    constructor(private messageLoader: ValidationMessagesLoader) { }

    /** Create messages if there's errors in the form it's watching
     *  @returns a MessageBag (if no errors an empty MessageBag)  
     */
    public build(watchingForm: FormGroup): Observable<MessageBag> {
        this.form = watchingForm;
        return Observable.of(this.buildErrors());
    }

    private buildErrors(): MessageBag {
        this.errors = new MessageBag();
        if (this.messageWasLoaded) {
            Object.keys(this.form.controls).forEach((field: string) => {
                this.seeForErrorsInField(field);
            });
        } else {
            this.messageLoader.load().subscribe((validationMessageRules) => {
                this.validationMessagesRules = new ValidationMessagesRules(validationMessageRules);
            });
        }
        return this.errors;
    }

    private get messageWasLoaded(): boolean {
        return !!this.validationMessagesRules;
    }

    private seeForErrorsInField(field: string): void {
        const control = this.form.get(field);
        if (!control.valid && control.dirty) {
            const errorMessage = this.createErrorMessagesFor(field, control.errors);
            this.errors.add(field, errorMessage);
        }
    }

    //TODO: refactor this to a new class
    attribute: string;
    errorKey: string;
    errorMessage: string;
    error: any;
    private createErrorMessagesFor(attribute: string, errors: any): string {
        this.attribute = attribute;
        this.error = errors;
        this.errorKey = Object.keys(errors)[0];

        return this.parseAttributePlaceHolders().parseErrorPlaceHolders();
    }

    parseAttributePlaceHolders() {
        const attributePlaceHolder = this.validationMessagesRules
                                         .getAttributePlaceHolder(this.attribute);
        this.errorMessage = this.validationMessagesRules
                                .getErrorMessage(this.errorKey)
                                .replace(':attribute', attributePlaceHolder);
        return this;
    }

    parseErrorPlaceHolders(): string {
        return MessageParserFactory.get(this.errorKey, this.error).format(this.errorMessage);
    }

}

class ValidationMessagesRules {
    constructor(private validationMessagesRules: any) {
    }

    getAttributePlaceHolder(attribute: string): string {
        if (this.containsCustomAttribute(attribute)) { // Custom has priority
            return this.getCustomAttributes(attribute);
        }
        return attribute;
    }


    getErrorMessage(errorKey: string): string {
        if (errorKey === 'customAttributes') {
            throw new SyntaxError('customAttributes is reserved');
        }
        return this.validationMessagesRules[errorKey];
    }

    private containsCustomAttribute(attribute: string): boolean {
        return !!this.getCustomAttributes(attribute);
    }

    private getCustomAttributes(attribute: string): string {
        return this.customAttributes[attribute];
    }

    private get customAttributes(): any {
        return this.validationMessagesRules['customAttributes'];
    }
}

class MessageParserFactory {
    static get(errorKey: string, error: any): MessageParser {
        switch (errorKey) {
            case 'minlength': return new MinLength(error);
            case 'maxlength': return new MaxLength(error);
            case 'required': return new NoFormat(error);
            default: throw SyntaxError(`The ${errorKey} isn't a validation rule`);
        }
    }
}

abstract class MessageParser {
    constructor(protected error: any) { }
    abstract format(message: string): string;
}

class NoFormat extends MessageParser {
    format(message: string): string {
        return message; // do nothing..
    }
}

class MinLength extends MessageParser {
    format(message: string): string {
        return message.replace(':min', this.error.minlength.requiredLength);
    }
}

class MaxLength extends MessageParser {
    format(message: string): string {
        return message.replace(':max', this.error.maxlength.requiredLength);
    }
}

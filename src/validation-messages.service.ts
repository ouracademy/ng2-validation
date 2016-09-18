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

    private createErrorMessagesFor(attribute: string, errors: any): string {
        return new MessageParser(errors, this.validationMessagesRules).parse(attribute);
    }
}

class MessageParser {
    errorMessage: string;
    errorKey: string;

    constructor(
        private errors: any,
        private validationMessagesRules: ValidationMessagesRules) {
        this.errorKey = Object.keys(errors)[0];
    }

    parse(attribute: string): string {
        return this.parseAttributePlaceHolders(attribute).parseErrorPlaceHolders();
    }

    private parseAttributePlaceHolders(attribute: string): MessageParser {
        const attributePlaceHolder = this.validationMessagesRules
            .getAttributePlaceHolder(attribute);
        this.errorMessage = this.validationMessagesRules
            .getErrorMessage(this.errorKey)
            .replace(':attribute', attributePlaceHolder);
        return this;
    }

    private parseErrorPlaceHolders(): string {
        return MessageParserFactory.get(this.errorKey, this.errors).format(this.errorMessage);
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
    static get(errorKey: string, error: any): ErrorMessageParser {
        switch (errorKey) {
            case 'minlength': return new MinLength(error);
            case 'maxlength': return new MaxLength(error);
            case 'required': return new NoFormat(error);
            default: throw SyntaxError(`The ${errorKey} isn't a validation rule`);
        }
    }
}

abstract class ErrorMessageParser {
    constructor(protected error: any) { }
    abstract format(message: string): string;
}

class NoFormat extends ErrorMessageParser {
    format(message: string): string {
        return message; // do nothing..
    }
}

class MinLength extends ErrorMessageParser {
    format(message: string): string {
        return message.replace(':min', this.error.minlength.requiredLength);
    }
}

class MaxLength extends ErrorMessageParser {
    format(message: string): string {
        return message.replace(':max', this.error.maxlength.requiredLength);
    }
}

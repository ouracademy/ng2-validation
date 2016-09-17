import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MessageBag } from './message-bag';
import { ValidationMessagesLoader } from './validation-messages-loader.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class ValidationMessagesService {
    private form: FormGroup;
    private errors: MessageBag;
    private validationMessages: any;

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
            this.messageLoader.load().subscribe((errorMessages) => {
                this.validationMessages = errorMessages;
            });
        }
        return this.errors;
    }

    private get messageWasLoaded(): boolean {
        return !!this.validationMessages;
    }

    private seeForErrorsInField(field: string): void {
        const control = this.form.get(field);
        if (!control.valid && control.dirty) {
            const errorMessage = this.createErrorMessagesFor(field, control.errors);
            this.errors.add(field, errorMessage);
        }
    }

    private createErrorMessagesFor(field: string, errors: any): string {
        const errorKey = Object.keys(errors)[0];

        let attributeName = field;
        const customAttributes = this.validationMessages['customAttributes'];
        console.log(customAttributes);
        
        const customAttribute = Object.keys(customAttributes)
                .find((attribute) => {
                    return attribute === field;
                }
                    );

        if (!!customAttribute) {
            attributeName = customAttributes[customAttribute];
        }

        const errorMessageWithReplacedAttribute = this.validationMessages[errorKey].replace(':attribute', attributeName);
        return MessageParserFactory.get(errorKey, errors).format(errorMessageWithReplacedAttribute);
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

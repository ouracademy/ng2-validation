import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MessageBag } from './message-bag';
import { ValidationMessagesLoader } from './validation-messages-loader.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class ValidationMessagesService {
    private form: FormGroup;
    private errors: any;
    private errorMessages: any;

    constructor(private messageLoader: ValidationMessagesLoader) { }

    /** Build messages if there's error in the form it's watching */
    public build(form: FormGroup): Observable<MessageBag> {
        return Observable.of(this.buildErrors(form));
    }

    private buildErrors(form: FormGroup): MessageBag {
        this.errors = new MessageBag();
        if (this.messageWasLoaded) {
            this.form = form;
            Object.keys(this.form.controls).forEach((field: string) => {
                this.seeForErrors(field);
            });
        } else {
            this.messageLoader.load().subscribe((errorMessages) => {
                this.errorMessages = errorMessages;
            });
        }
        return this.errors;
    }

    private get messageWasLoaded(): boolean {
        return !!this.errorMessages;
    }

    private seeForErrors(field: string): void {
        const control = this.form.get(field);
        if (!control.valid && control.dirty) {
            this.createErrorMessagesFor(field, control);
        }
    }

    private createErrorMessagesFor(field: string, control: AbstractControl) {
        Object.keys(control.errors).forEach((errorKey: string) => {
            const baseErrorMessage = this.errorMessages[errorKey].replace(':attribute', field);
            const errorMessage = MessageParserFactory.get(errorKey, control.errors).format(baseErrorMessage);
            this.errors.add(field, errorMessage);
        });
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

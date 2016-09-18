import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageBag } from '../message-bag';
import { ValidationMessagesLoader } from './validation-messages-loader.service';
import { Observable } from 'rxjs/Observable';
import { ValidationMessagesRules } from './validation-messages-rules';
import { MessageParser } from '../message-parser/index';
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

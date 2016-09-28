import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageBag } from '../message-bag';
import { ValidationMessagesLoader } from './loader/index';
import { Subject } from 'rxjs/Subject';
import { ValidationMessagesRules } from './validation-messages-rules';
import { MessageParser } from '../message-parser/index';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Injectable()
export class ValidationMessagesService {
    private form: FormGroup;
    private errors: MessageBag;
    private validationMessagesRules: ValidationMessagesRules;
    private formChanges: Subject<MessageBag>;

    constructor(private messageLoader: ValidationMessagesLoader) {
        this.formChanges = new Subject<MessageBag>();
    }

    /** Create messages if there's errors in the form it's watching
     *  @returns a MessageBag (if no errors an empty MessageBag)  
     */
    public seeForErrors(watchingForm: FormGroup): Subject<MessageBag> {
        this.formChanges.next(this.buildErrors(watchingForm));
        watchingForm.valueChanges
            .subscribe(data => {
                this.formChanges.next(this.buildErrors(watchingForm));
            });

        return this.formChanges;
    }

    private buildErrors(watchingForm: FormGroup): MessageBag {
        this.form = watchingForm;
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

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Hero } from '../shared/hero';
import { MessageBag } from '../../src/message-bag';

@Component({
    moduleId: module.id,
    selector: 'hero-form-reactive3',
    templateUrl: 'hero-form.component.html'
})
export class HeroFormReactiveComponent implements OnInit {

    powers = ['Really Smart', 'Super Flexible', 'Weather Changer'];

    hero = new Hero(18, 'Dr. WhatIsHisName', this.powers[0], 'Dr. What');

    submitted = false;

    errors: any;

    heroForm: FormGroup;
    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.buildForm();
    }

    onSubmit() {
        this.submitted = true;
        this.hero = this.heroForm.value;
    }

    // Reset the form with a new hero AND restore 'pristine' class state
    // by toggling 'active' flag which causes the form
    // to be removed/re-added in a tick via NgIf
    // TODO: Workaround until NgForm has a reset method (#6822)
    active = true;
    addHero() {
        this.hero = new Hero(42, '', '');
        this.buildForm();

        this.active = false;
        setTimeout(() => this.active = true, 0);
    }

    buildForm(): void {
        this.heroForm = this.fb.group({
            'name': [this.hero.name, [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(24)
            ]
            ],
            'alterEgo': [this.hero.alterEgo, Validators.minLength(4)],
            'power': [this.hero.power, Validators.required]
        });

        this.heroForm.valueChanges
            .subscribe(data => {
                this.seeForErrors();
            });

        this.seeForErrors(); // (re)set validation messages now
    }

    private seeForErrors() {
        this.errors = new MessageErrorBuilder(this.heroForm).build();
    }
}

const errorMessages = {
    'required': 'The :attribute is required.',
    'minlength': 'The :attribute must be at least :min characters long.',
    'maxlength': 'The :attribute cannot be more than :max characters long.'
};

class MessageErrorBuilder {
    form: FormGroup;
    private errors: any;

    constructor(form: FormGroup) {
        this.form = form;
    }

    /** Build messages if there's error in the form it's watching */
    public build(): any {
        this.errors = new MessageBag();

        Object.keys(this.form.controls).forEach((field: string) => {
            this.seeForErrors(field);
        });

        return this.errors;
    }

    private seeForErrors(field: string): void {
        const control = this.form.get(field);
        if (!control.valid && control.dirty) {
            this.createErrorMessagesFor(field, control);
        }
    }

    private createErrorMessagesFor(field: string, control: AbstractControl) {
        Object.keys(control.errors).forEach((errorKey: string) => {
            const baseErrorMessage = (<string>errorMessages[errorKey]).replace(':attribute', field);
            const errorMessage = MessageFormatterFactory.get(errorKey, control.errors).format(baseErrorMessage);
            this.errors.add(field, errorMessage);
        });
    }
}

class MessageFormatterFactory {
    static get(errorKey: string, error: any): MessageParser {
        let messageFormatter: MessageParser = new NoFormat(error);
        switch (errorKey) {
            case 'minlength':
                messageFormatter = new MinLength(error);
                break;
            case 'maxlength':
                messageFormatter = new MaxLength(error);
                break;
        }
        return messageFormatter;
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

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Hero } from '../shared/hero';

@Component({
    moduleId: module.id,
    selector: 'hero-form-reactive3',
    templateUrl: 'hero-form.component.html'
})
export class HeroFormReactiveComponent implements OnInit {

    powers = ['Really Smart', 'Super Flexible', 'Weather Changer'];

    hero = new Hero(18, 'Dr. WhatIsHisName', this.powers[0], 'Dr. What');

    submitted = false;

    errors: MessageBag;

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

// interface ErrorMessage {
//     rule: string;
//     message: string;
// }

const errorMessages = {
    'required':  ':attribute is required.',
    'minlength': ':attribute must be at least 4 characters long.',
    'maxlength': ':attribute cannot be more than 24 characters long.'
};

class MessageErrorBuilder {
    seeWhen: Function;
    form: FormGroup;
    private errors: MessageBag;

    constructor(form: FormGroup, seeWhen?: Function) {
        this.form = form;
        if (!!seeWhen) {
            this.seeWhen = seeWhen;
        } else {
            // By default see for errors when is dirty
            this.seeWhen = function (control: AbstractControl): boolean {
                return control.dirty;
            };
        }
    }

    /** Build messages if there's error in the form it's watching */
    public build(): MessageBag {
        this.errors = new MessageBag();

        Object.keys(this.form.controls).forEach((field: string) => {
            this.seeForErrors(field);
        });

        return this.errors;
    }

    private seeForErrors(field: string): void {
        const control = this.form.get(field);
        if (!control.valid && this.seeWhen(control)) {
            this.createErrorMessagesFor(field, control);
        }
    }

    private createErrorMessagesFor(field: string, control: AbstractControl) {
        Object.keys(control.errors).forEach((errorKey: string) => {
            const errorMessage = (<string>errorMessages[errorKey]).replace(':attribute',field);
            this.errors.add(field, errorMessage);
        });
    }
}

class MessageFormatter {

}

class MessageBag {
    private messages: Map<string, Set<string>>;

    constructor() {
        this.messages = new Map<string, Set<string>>();
    }

    add(field: string, message: string) {
        if (this.has(field)) {
            let fieldMessages = this.get(field).add(message);
            this.messages.set(field, fieldMessages);
        } else {
            this.messages.set(field, new Set<string>().add(message));
        }
    }

    get count(): number {
        return this.messages.size;
    }

    first(field: string): string {
        return this.get(field).values().next().value;
    }

    get(field: string): Set<string> {
        return this.messages.get(field);
    }

    has(field: string) {
        return this.messages.has(field);
    }
}

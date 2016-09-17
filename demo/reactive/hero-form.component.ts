import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Hero } from '../shared/hero';
import { MessageBag, ValidationMessagesService } from '../../src';

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

    constructor(private fb: FormBuilder,
        private validationMessagesService: ValidationMessagesService) { }

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
            'alterEgo': [this.hero.alterEgo, Validators.maxLength(4)],
            'power': [this.hero.power, Validators.required]
        });

        this.heroForm.valueChanges
            .subscribe(data => {
                this.seeForErrors();
            });

        this.seeForErrors(); // (re)set validation messages now
    }

    private seeForErrors() {
        this.validationMessagesService
            .build(this.heroForm)
            .subscribe((errors: MessageBag) => this.errors = errors);
    }
}

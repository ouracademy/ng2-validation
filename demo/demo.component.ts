import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Hero } from './hero';

import { MessageBag, ValidationMessagesService } from '../src';

@Component({
  selector: 'v-demo-app',
  template: `
    <div class="container">
      <div [hidden]="submitted">
        <h1>Hero Form 3 (Reactive)</h1>
        <form [formGroup]="heroForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Name</label>
    
            <input type="text" id="name" class="form-control" formControlName="name" required>
            
          </div>
    
          <div class="form-group">
            <label for="alterEgo">Alter Ego</label>
            <input type="text" id="alterEgo" class="form-control" formControlName="alterEgo">
          </div>
          <!--Using typed form-->
          <!--And using custom attribute, see i18n/validation.json file-->
          
    
          <div class="form-group">
            <label for="fullName">Just alphabetic caracters(with Validators.pattern)</label>
            <input type="text" id="fullName" class="form-control" formControlName="fullName">
          </div>
          
    
          <div class="form-group">
            <label for="power">Hero Power</label>
            <select id="power" class="form-control" formControlName="power" required>
              <option *ngFor="let p of powers" [value]="p">{{p}}</option>
            </select>
    
            
          </div>
    
          <button type="submit" class="btn btn-default" [disabled]="!heroForm.valid">Submit</button>
          <button type="button" class="btn btn-default" (click)="addHero()">New Hero</button>
        </form>
      </div>
    
      <v-hero-submitted [hero]="hero" [(submitted)]="submitted"></v-hero-submitted>
    </div>
  `
})
export class DemoComponent implements OnInit {
    powers: string[] = ['Really Smart', 'Super Flexible', 'Weather Changer'];
    hero: Hero = new Hero(18, 'Dr. WhatIsHisName', this.powers[0], 'Dr. What');
    submitted: boolean = false;

    heroForm: FormGroup;
    errors: MessageBag = new MessageBag();

    constructor(private fb: FormBuilder,
        private validationMessages: ValidationMessagesService) { }

    ngOnInit(): void {
        this.buildForm();
    }

    buildForm(): void {
        this.heroForm = this.fb.group({
            'name': [this.hero.name, [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(24)
            ]],
            'alterEgo': [this.hero.alterEgo, Validators.maxLength(4)],
            'power': [this.hero.power, Validators.required],
            // The above are more field examples
            'fullName': ['', Validators.pattern('[a-zA-Z]*')] // An example of use regex pattern
        });

        this.validationMessages
              .from(this.heroForm)
              .subscribe((errors: MessageBag) => this.errors = errors);
    }

    onSubmit(): void {
        this.submitted = true;
        this.hero = this.heroForm.value;
    }

    addHero(): void {
        this.heroForm.reset();
    }
}

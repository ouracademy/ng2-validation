#ng2-custom-validation [![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] 

[npm-downloads-image]: http://img.shields.io/npm/dm/ng2-custom-validation.svg?style=flat
[npm-version-image]: http://img.shields.io/npm/v/ng2-custom-validation.svg?style=flat
[npm-url]: https://www.npmjs.com/package/ng2-custom-validation

A collection of classes to help handling display error messages on your form. (THIS PACKAGE IT'S ON CONSTRUCTION)

* [Reason](#reason)
* [Installation](#installation)
* [Usage](#usage)
* [Validators](#validators)
* [Customizing](#customizing)
* [TODO](#todo)

## Reason

Tired to always write this in your angular 2 app:
```html
<label for="name">Name</label>

<input type="text" id="name" class="form-control"
       required minlength="4" maxlength="24"
       name="name" [(ngModel)]="hero.name"
       #name="ngModel" >

<div *ngIf="name.errors && (name.dirty || name.touched)"
     class="alert alert-danger">
    <div [hidden]="!name.errors.required">
      Name is required
    </div>
    <div [hidden]="!name.errors.minlength">
      Name must be at least 4 characters long.
    </div>
    <div [hidden]="!name.errors.maxlength">
      Name cannot be more than 24 characters long.
    </div>
</div>

```

And repeat this to every field in every form in every view.
This package deals with it, using a uniform approach to make validation messages based on the amazing [Laravel framework](https://laravel.com/docs/5.3/validation#working-with-error-messages).
So you can instead do this: 

```html
<label for="name">Name</label>
<input type="text" id="name" class="form-control"
       required minlength="4" maxlength="24"
       name="name" [(ngModel)]="hero.name"
       #name="ngModel" >
<div *ngIf="errors.name" class="alert alert-danger">
  {{ errors.name }}
</div>
```

And it will do the same in very uniform way in all your fields in every forms in all your views. This package will create validation messages for you. It contains predefined validation messages, but you can customize it (see [customizing](#customizing)).

## Installation
Install the npm module by running:
```sh
npm install ng2-custom-validation --save
```

### Working with SystemJS
Add to your `systemjs.config.js`

```js
map: {
      // other stuff...
      'ng2-custom-validation': 'npm:ng2-custom-validation'
    },
packages: {
    // other stuf...
    'ng2-custom-validation': {
        main: './index.js',
        defaultExtension: 'js'
    }
}
```

## Usage
The steps here are very similar to the [ng2-translate](https://github.com/ocombe/ng2-translate) package, because it's based on it.
Alternative you can see the [demo app](https://github.com/ouracademy/ng2-validation/tree/master/demo) to have a more detail of the usage.

#### 1. Import the `ValidationMessagesModule`:
It is recommended to import `ValidationMessagesModule.forRoot()` in the NgModule of your application.

The `forRoot` method is a convention for modules that provide a singleton service (such as the Angular 2 Router), you can also use it to configure the `ValidationMessagesLoader` . By default it will use the `MessageStaticLoader` and will load predefined messages for you, but you can provide another loader instead as a parameter of this method (see [customizing](#customizing)).

```ts
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent }           from './app.component';
import { ValidationMessagesModule } from 'ng2-custom-validation';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    HeroFormReactiveModule,
    ValidationMessagesModule.forRoot()
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
```

If you have multiple NgModules and you use one as a shared NgModule (that you import in all of your other NgModules), don't forget that you can use it to export the `ValidationMessagesModule` that you imported in order to avoid having to import it multiple times.

```ts
@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        ValidationMessagesModule.forRoot()
    ],
    exports: [BrowserModule, HttpModule, ValidationMessagesModule],
})
export class SharedModule {
}
```

#### 2. Init the ValidationMessagesService for your application:
```ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageBag, ValidationMessagesService } from 'ng2-custom-validation';

@Component({
    moduleId: module.id,
    selector: 'hero-form-reactive3',
    templateUrl: 'hero-form.component.html'
})
export class HeroFormReactiveComponent implements OnInit {

    errors: MessageBag = new MessageBag();
    heroForm: FormGroup;

    constructor(private fb: FormBuilder,
        private validationMessagesService: ValidationMessagesService) { }
        
    ngOnInit(): void {
        this.buildForm();
    }
    
    buildForm(): void {
        this.heroForm = this.fb.group({
            'name': ['', [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(24)
            ]]
        });

        this.validationMessagesService
            .seeForErrors(this.heroForm)
            .subscribe((errors: MessageBag) => {
                this.errors = errors;
            });
    }

```

#### 3. Use it on your template:
```html
<label for="name">Name</label>
<input id="name" type="text" class="form-control" required formControlName="name">
<div *ngIf="errors.name" class="alert alert-danger">
  {{ errors.name }}
</div>
```

## Validators
This is the list of the supported validations (it will grow...)

#### angular2 built-in validators

- required
- minlength
- maxlength
- pattern

## Customizing
There are two ways of customizing the validationMessages: extending the default validation messages or providing your own loader. In the [demo](https://github.com/ouracademy/ng2-validation/tree/master/demo) there are an example of using both ways.

### 1. Using defaultValidationMessages
Create your file of custom validation messages (for example `custom-validation`)
```ts
import { defaultValidationMessages } from '../src';

// An example of overriding the name field to super name
//do the same with any validation message (min, required...)
defaultValidationMessages.customAttributes = {
    'name': 'super name'
}; 
```

And import it in your NgModule(for example the RootComponent):

```ts
import { NgModule }      from '@angular/core';
import { AppComponent }           from './app.component';
//...import other modules
import { ValidationMessagesModule } from 'ng2-custom-validation';
import './custom-validation';

@NgModule({
  imports: [
    //your modules
    ValidationMessagesModule.forRoot()
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
```

### 2. Write and use your own loader
If you want to write your own loader, you need to create a class that implements ValidationMessagesLoader. The only required method is load() that must return an Observable. If your loader is synchronous, just use Observable.of to create an observable from your static value.

```ts
class CustomLoader implements ValidationMessagesLoader {
    load(): Observable<any> {
        //Your implementation...
    }
}
```

Once you've defined your loader, you can provide it in your NgModule by adding it to its providers property. Don't forget that you have to import ValidationMessagesModule as well:

```ts
@NgModule({
    imports: [
        BrowserModule,
        //construct with your params
        ValidationMessagesModule.forRoot({ provide: ValidationMessagesLoader, useFactory: () => new CustomLoader() }) 
    ],
    exports: [ValidationMessagesModule],
})
export class SharedModule {
}
```

## TODO
This package it's creating on free times after university...and theses...
For now works with Reactive Driven Forms, it wasn't tested with Template Driven Forms. Probably it will work, if work send us a message.
Also it doesn't work with Composite Form Groups (and unique Controls) and doesn't have a way to add more ErrorPlaceholderParser (this is if you create your own Validator, you can't add it to the validation messages to show..this will be fixed soon).

There's a list of things that are in our roadmap. You can see it in the [TODO file](https://github.com/ouracademy/ng2-validation/blob/master/TODO)

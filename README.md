# ng2-custom-validation [![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] 

[npm-downloads-image]: http://img.shields.io/npm/dm/ng2-custom-validation.svg?style=flat
[npm-version-image]: http://img.shields.io/npm/v/ng2-custom-validation.svg?style=flat
[npm-url]: https://www.npmjs.com/package/ng2-custom-validation

A collection of classes to help handling display error messages on your form.
PLEASE REFER TO THE DEPRECATED BRANCH THIS IS THE README OF THE v2.0 THAT IS ON CONSTRUCTION

* [Demo](#demo)
* [Reason](#reason)
* [Installation](#installation)
* [Usage](#usage)
* [Validators](#validators)
* [Customizing](#customizing)
* [Integration with other packages](#integration)
* [Development](#development)
* [TODO](#todo)

## Demo
https://ouracademy.github.io/ng2-validation/

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
      'ng2-custom-validation': 'node_modules/ng2-custom-validation/bundles/ng2-custom-validation.umd.js'
    },
packages: {
    // other stuf...
    'ng2-custom-validation': {
        defaultExtension: 'js'
    }
}
```

## Usage
The steps here are very similar to the [ngx-translate](https://github.com/ngx-translate/core) package, because it's based on it.
Alternative you can see the [demo app](https://github.com/ouracademy/ng2-validation/tree/master/demo) to have a more detail of the usage.

#### 1. Import the `ValidationMessagesModule`:

The [`forRoot`](https://angular.io/docs/ts/latest/guide/ngmodule.html#!#core-for-root) static method is a convention that provides and configures services at the same time.
Make sure you only call this method in the root module of your application, most of the time called `AppModule`.
This method allows you to configure the `ValidationMessagesModule` by specifying a loader, a parser and/or a missing validation messages handler, as it's described in [customizing](#customizing).

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

If you use a [`SharedModule`](https://angular.io/docs/ts/latest/guide/ngmodule.html#!#shared-modules) that you import in multiple other feature modules,
you can export the `ValidationMessagesModule` to make sure you don't have to import it in every module.

```ts
@NgModule({
    exports: [BrowserModule, HttpModule, ValidationMessagesModule],
})
export class SharedModule {
}
```

> Note: Never call a `forRoot` static method in the `SharedModule`. You might end up with different instances of the service in your injector tree.

##### Lazy loaded modules
TODO

##### AoT
TODO

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

    constructor(private fb: FormBuilder, private validationMessages: ValidationMessagesService) { }
        
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

        this.validationMessages
            .from(this.heroForm)
            .subscribe((errors: MessageBag) => {
                this.errors = errors;
            });
            
        // or using observables ($errors must be of type Observable<MessageBag>)
        // this.$errors = this.validationMessages.from(this.heroForm);
    }

```

#### 3. Use it on your template:
```html
<label for="name">Name</label>
<input id="name" type="text" class="form-control" required formControlName="name">
<div *ngIf="errors.name" class="alert alert-danger">
  {{ errors.name }}
</div>
<!-- Using observables you should use the async pipe
<div *ngIf="(errors| async)?.name" class="alert alert-danger">
  {{ (errors| async)?.name }}
</div>
-->
```

## Validators
This is the list of the supported validations

#### angular2 built-in validators

- required
- minlength
- maxlength
- pattern

## Customizing
You can customize the predefined messages (instead of the predefined message for the required Validator: "The {{attribute}} field is required", get "Please, fill the {{attribute}}", change the display name of an attribute - like instead of "email" display "email address"), the parser (instead of define the display value of an attribute with "{{attribute}}" use ":attribute" - if you prefer the Laravel style) or change the missing validation message handler.

### 1. Predefined messages

There are two ways of customizing the validationMessages: extending the default validation messages or providing your own loader. In the [demo](https://github.com/ouracademy/ng2-validation/tree/master/demo) there are an example of using both ways.

#### Using defaultValidationMessages
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

#### Write and use your own loader
If you want to write your own loader, you need to create a class that implements ValidationMessagesLoader. The only required method is load() that must return an Observable. If your loader is synchronous, just use Observable.of to create an observable from your static value.

```ts
class CustomLoader implements ValidationMessagesLoader {
    load(): Observable<any> {
        //Your own implementation...maybe like the HttpLoader of the ngx-translate/http-loader package 
    }
}
```

Once you've defined your loader, you can provide it in your NgModule by passing it in the `loader` parameter of the `forRoot` configuration . Don't forget that you have to import ValidationMessagesModule as well:

```ts
@NgModule({
    imports: [
        // other imports..
        //construct with your params
        ValidationMessagesModule.forRoot({ loader: {provide: ValidationMessagesLoader, useClass: CustomLoader }}) 
    ],
    exports: [ValidationMessagesModule],
})
export class SharedModule {
}
```

### 2. Custom your own parser
The steps here are similar to the section [Write and use your own loader](#write-and-use-your-own-loader), with the difference of passing your custom parser to the `parser` parameter of the `forRoot` configuration and of course [defining all the predefined messages](#using-defaultvalidationmessages) (because the predefined messages are understood by this package by using the predefined parser). 

### 3. Custom your own missingValidationMessagesHandler
The steps here are similar to the section [Write and use your own loader](#write-and-use-your-own-loader).

## Integration
This package will work with the ngx-translate package, by using the HttpTranslateLoader.

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM (should come with)
* Install local dev dependencies: `npm install` while current directory is this repo

### Development server
Run `npm start` to start a development server on port 8000 with auto reload + tests.

### Testing
Run `npm test` to run tests once or `npm run test:watch` to continually run tests.

### Release
* Bump the version in package.json (once the module hits 1.0 this will become automatic)
```bash
npm run release
```

## TODO
This package it's creating on free times after university...and theses...
For now works with Reactive Driven Forms, it wasn't tested with Template Driven Forms. Probably it will work, if work send us a message.
Also it doesn't work with Composite Form Groups (and unique Controls) and doesn't have a way to add more ErrorPlaceholderParser (this is if you create your own Validator, you can't add it to the validation messages to show..this will be fixed soon).

There's a list of things that are in our roadmap. You can see it in the [TODO file](https://github.com/ouracademy/ng2-validation/blob/master/TODO)

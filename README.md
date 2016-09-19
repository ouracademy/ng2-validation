#ng2-validation

A collection of classes to help handling display error messages on your form.


* [Reason](#reason)
* [Installation](#installation)
* [Usage](#usage)
* [FAQ](#faq) 

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

(The above is an example. This package for now is working with with Reactive Driven Forms, it wasn't tested with Template Driven Forms)

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

And it will do the same in very uniform way in all your fields in every forms in all your views.
So just customize your validation messages, like:

```json
{
    "required": "The :attribute is required.",
    "minlength": "The :attribute must be at least :min characters long.",
    "maxlength": "The :attribute cannot be more than :max characters long.",
    "customAttributes" : {
        "alterEgo" : "secondSelf"
    }
}
```

## Installation
Install the npm module by running:
```sh
npm install ng2-custom-validation --save
```

### Working with SystemJS

## Usage
The steps here are very similar to the [ng2-translate](https://github.com/ocombe/ng2-translate) package, because it's based on it.

#### 1. Import the `ValidationMessagesModule`:
It is recommended to import `ValidationMessagesModule.forRoot()` in the NgModule of your application.

The `forRoot` method is a convention for modules that provide a singleton service (such as the Angular 2 Router), you can also use it to configure the `ValidationMessagesLoader` . By default it will use the `StaticMessageLoader`, but you can provide another loader instead as a parameter of this method.

For now ng2-custom-validation requires HttpModule from `@angular/http` (this will change soon).


```ts
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent }           from './app.component';
import { ValidationMessagesModule } from 'ng2-custom-validation/src/index';

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

By default, only the `StaticMessageLoader` is available. It will search for files in i18n/*.json, if you want you can customize this behavior by changing the default prefix/suffix:

```ts
@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        ValidationMessagesModule.forRoot({ 
          provide: ValidationMessagesLoader,
          useFactory: (http: Http) => new StaticMessageLoader(http, '/assets/i18n', '.json'),
          deps: [Http]
        })
    ],
    exports: [BrowserModule, HttpModule, ValidationMessagesModule],
})
export class SharedModule {
}
```

## FAQ
#### I'm getting an error `No provider for Http!`
Because of the StaticMessageLoader you have to load the HttpModule from `@angular/http`, even if you don't use this Loader

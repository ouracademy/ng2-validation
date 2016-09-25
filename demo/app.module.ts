// This file contains:
// 1. How to import the ValidationMessagesModule
// 2. The 2 ways of customize the validation messages: one in base
//    of the defaultValidationMessages (see the ./custom-validation.ts file)
//    and the other pass a custom function(e.g customMessageLoaderFactory)
//    to create a ValidationMessagesLoader and pass it to the forRoot() method
//    of the ValidationMessagesModule

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }           from './app.component';
import { HeroFormReactiveModule } from './reactive/hero-form.module';

import { ValidationMessagesModule } from '../src';
// The first form of customize validation messages
import './custom-validation';

// The second form of customize validation messages
// import { ValidationMessagesLoader } from '../src';
// import { customMessageLoaderFactory } from './custom-validation-loader';

@NgModule({
  imports: [
    BrowserModule,
    HeroFormReactiveModule,
    ValidationMessagesModule.forRoot()
    // The second form of customize validation messages
    // See the custom-validation-loader.ts file
    // ValidationMessagesModule.forRoot({
    //     provide: ValidationMessagesLoader,
    //     useFactory: customMessageLoaderFactory
    // })
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }           from './app.component';
import { HeroFormReactiveModule } from './reactive/hero-form.module';
import { ValidationMessagesModule } from '../src';

@NgModule({
  imports: [
    BrowserModule,
    HeroFormReactiveModule,
    ValidationMessagesModule.forRoot()
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
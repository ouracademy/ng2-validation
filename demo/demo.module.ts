import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationMessagesModule } from '../src';

import { DemoComponent } from './demo.component';
import { SubmittedComponent } from './submitted.component';

@NgModule({
  declarations: [
    SubmittedComponent,
    DemoComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    ValidationMessagesModule.forRoot()
    ],
  bootstrap: [DemoComponent]
})
export class DemoModule {}
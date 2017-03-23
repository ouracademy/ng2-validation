import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ValidationMessagesModule } from '../src';
import { DemoComponent } from './demo.component';

@NgModule({
  declarations: [DemoComponent],
  imports: [BrowserModule, ValidationMessagesModule.forRoot()],
  bootstrap: [DemoComponent]
})
export class DemoModule {}
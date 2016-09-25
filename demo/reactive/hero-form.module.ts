import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { HeroFormReactiveComponent } from './hero-form.component';


@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    HeroFormReactiveComponent
  ],
  exports: [
    HeroFormReactiveComponent
  ]
})
export class HeroFormReactiveModule { }
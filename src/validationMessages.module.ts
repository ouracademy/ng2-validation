import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelloWorldComponent } from './helloWorld.component'; // TODO will be deleted
import { ValidationMessagesService } from './index';

@NgModule({
  declarations: [
    HelloWorldComponent
  ],
  imports: [CommonModule],
  exports: [ HelloWorldComponent],
  providers:[]
})
export class ValidationMessagesModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ValidationMessagesModule,
      providers: [ValidationMessagesService]
    };
  }

}
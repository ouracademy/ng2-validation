import { Component } from '@angular/core';

@Component({
  selector: 'v-hello-world',
  template: 'Hello world from the {{ projectTitle }} module!'
})
export class HelloWorldComponent {
  projectTitle: string = 'ng2 custom validation';
}

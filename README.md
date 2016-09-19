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

And repeat this to every field in every form in every view.
This package deals with it, using a uniform approach to make validation messages based on the amazing [Laravel framework](https://laravel.com/docs/5.3/validation#working-with-error-messages)
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

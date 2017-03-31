export * from './validationMessages.module';

import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class ValidationMessagesService {
    public from(watchingForm: FormGroup): Observable<MessageBag> {
        return Observable.of(new MessageBag());
    }
}

export class TypedMessageBag {
    private messages: Map<string, Set<string>>;

    constructor() {
        this.messages = new Map<string, Set<string>>();
    }

    add(field: string, message: string): void {
        if (this.has(field)) {
            let fieldMessages: Set<string> = this.get(field).add(message);
            this.messages.set(field, fieldMessages);
        } else {
            this.messages.set(field, new Set<string>().add(message));
        }
    }

    get count(): number {
        return this.messages.size;
    }

    first(field: string): string {
        return this.get(field).values().next().value;
    }

    get(field: string): Set<string> {
        return this.messages.get(field);
    }

    has(field: string): boolean {
        return this.messages.has(field);
    }
}

/** A reflective message bag */
export class MessageBag extends TypedMessageBag {
    add(field: string, message: string): void {
        super.add(field, message);
        this[field] = message;
    }
}
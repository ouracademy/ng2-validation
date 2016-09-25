import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ValidationMessagesLoader } from './loader.service';
import { defaultValidationMessages } from './default-validation-messages'; 

@Injectable()
export class MessageStaticLoader implements ValidationMessagesLoader {
    private validationMessages: any;

    constructor(validationMessages?: any) {
        this.validationMessages = !!validationMessages ? validationMessages : defaultValidationMessages;
    }

    load(): Observable<any> {
        return Observable.of(this.validationMessages);
    }
}

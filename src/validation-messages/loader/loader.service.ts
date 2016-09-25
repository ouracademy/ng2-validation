import { Observable } from 'rxjs/Observable';

export abstract class ValidationMessagesLoader {
    abstract load(): Observable<any>;
}

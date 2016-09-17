import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export abstract class ValidationMessagesLoader {
    abstract load(): Observable<any>;
}

@Injectable()
export class StaticMessageLoader implements ValidationMessagesLoader {
    constructor(private http: Http, private prefix = 'i18n', private suffix = '.json') {
    }

    load(): Observable<any> {
        return this.http.get(`${this.prefix}/validation${this.suffix}`)
             .map((res: Response) => res.json());
    }
}

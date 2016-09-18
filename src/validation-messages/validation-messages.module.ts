import { NgModule, ModuleWithProviders } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { ValidationMessagesService } from './validation-messages.service';

import { ValidationMessagesLoader, StaticMessageLoader } from './validation-messages-loader.service';

export function messageLoaderFactory(http: Http) {
    return new StaticMessageLoader(http);
}

@NgModule({
    imports: [HttpModule],
    exports: [],
    declarations: []
})
export class ValidationMessagesModule {
    static forRoot(providedLoader: any = {
        provide: ValidationMessagesLoader,
        useFactory: messageLoaderFactory,
        deps: [Http]
    }): ModuleWithProviders {
        return {
            ngModule: ValidationMessagesModule,
            providers: [providedLoader, ValidationMessagesService]
        };
    }
}

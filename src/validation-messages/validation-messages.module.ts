import { NgModule, ModuleWithProviders } from '@angular/core';
import { ValidationMessagesService } from './validation-messages.service';

import { ValidationMessagesLoader, MessageStaticLoader } from './loader/index';

export function messageLoaderFactory() {
    return new MessageStaticLoader;
}

@NgModule({
    imports: [],
    exports: [],
    declarations: []
})
export class ValidationMessagesModule {
    static forRoot(providedLoader: any = {
        provide: ValidationMessagesLoader,
        useFactory: messageLoaderFactory
    }): ModuleWithProviders {
        return {
            ngModule: ValidationMessagesModule,
            providers: [providedLoader, ValidationMessagesService]
        };
    }
}

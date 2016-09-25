import { MessageStaticLoader } from '../src';

// A custom function that creates your own way of load validation messages
export function customMessageLoaderFactory() {
    // You could use the MessageStaticLoader and pass a completely new object of validation messages 
    // following the defaultValidationMessages structure
    return new MessageStaticLoader({
        'required': 'The :attribute is required!!!!',
        'minlength': 'The :attribute must be at least :min characters long.',
        'maxlength': 'The :attribute cannot be more than :max characters long.',
        'pattern': 'The :attribute format is totally invalid.',
        'customAttributes': {
        }
    });

    // or you can construct your own ValidationMessageLoader, instead of use
    // the MessageStaticLoader class
};

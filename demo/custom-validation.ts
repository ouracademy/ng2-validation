import { defaultValidationMessages } from '../src';

// An example of overriding the alterEgo field to secondSelf
// using the defaultValidationMessages
defaultValidationMessages.customAttributes = {
    'alterEgo': 'secondSelf'
};

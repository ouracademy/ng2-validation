import { ValidationMessagesRules } from '../validation-messages/index';

export class MessageParser {
    errorMessage: string;
    errorKey: string;

    constructor(
        private errors: any,
        private validationMessagesRules: ValidationMessagesRules) {
        this.errorKey = Object.keys(errors)[0];
    }

    parse(attribute: string): string {
        return this.parseAttributePlaceHolders(attribute).parseErrorPlaceHolders();
    }

    private parseAttributePlaceHolders(attribute: string): MessageParser {
        const attributePlaceHolder = this.validationMessagesRules
            .getAttributePlaceHolder(attribute);
        this.errorMessage = this.validationMessagesRules
            .getErrorMessage(this.errorKey)
            .replace(':attribute', attributePlaceHolder);
        return this;
    }

    private parseErrorPlaceHolders(): string {
        return ErrorMessageParserFactory.get(this.errorKey, this.errors).format(this.errorMessage);
    }
}


class ErrorMessageParserFactory {
    static get(errorKey: string, error: any): ErrorPlaceholderParser {
        switch (errorKey) {
            case 'minlength': return new MinLength(error);
            case 'maxlength': return new MaxLength(error);
            case 'required': return new NoFormat(error);
            default: throw SyntaxError(`The ${errorKey} isn't a validation rule`);
        }
    }
}

abstract class ErrorPlaceholderParser {
    constructor(protected error: any) { }
    abstract format(message: string): string;
}

class NoFormat extends ErrorPlaceholderParser {
    format(message: string): string {
        return message; // do nothing..
    }
}

class MinLength extends ErrorPlaceholderParser {
    format(message: string): string {
        return message.replace(':min', this.error.minlength.requiredLength);
    }
}

class MaxLength extends ErrorPlaceholderParser {
    format(message: string): string {
        return message.replace(':max', this.error.maxlength.requiredLength);
    }
}

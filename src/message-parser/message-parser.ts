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
        return this.parseAttributePlaceHolders(attribute).parseErrorPlaceholders();
    }

    private parseAttributePlaceHolders(attribute: string): MessageParser {
        const attributePlaceHolder = this.validationMessagesRules
            .getAttributePlaceHolder(attribute);
        this.errorMessage = this.validationMessagesRules
            .getErrorMessage(this.errorKey)
            .replace(':attribute', attributePlaceHolder);
        return this;
    }

    private parseErrorPlaceholders(): string {
        return ErrorPlaceholderParser.parse(this.errorMessage).with(this.errorKey, this.errors);
    }
}

class ErrorPlaceholderParser {
    private error: any;
    static parse(errorMessage: string): ErrorPlaceholderParser {
        return new ErrorPlaceholderParser(errorMessage);
    }

    private constructor(private errorMessage: string) { }

    with(errorKey: string, error: any): string {
        this.error = error;
        const errorFormatRule = ErrorFormatRuleLoader.get(errorKey, error);

        this.errorMessage = this.parseErrorMessage(errorFormatRule);
        return this.errorMessage;
    }

    parseErrorMessage(errorFormatRule: ErrorFormatRule): string {
        if (errorFormatRule.placeholders) {
            return Object.keys(errorFormatRule.placeholders)
                .map((placeholder) => {
                    const valueRule = errorFormatRule.placeholders[placeholder];
                    const errorValue = this.error[errorFormatRule.errorKey][valueRule];
                    return this.errorMessage.replace(placeholder, errorValue);
                })[0];
        } else { // if no placeholders, return the same error message
            return this.errorMessage;
        }
    }
}

interface ErrorFormatRule {
    errorKey: string;
    placeholders?: any;
}

class ErrorFormatRuleLoader {
    static errorFormatRule: ErrorFormatRule[] = [
        {
            errorKey: 'minlength',
            placeholders: {
                ':min': 'requiredLength'
            }
        },
        {
            errorKey: 'maxlength',
            placeholders: {
                ':max': 'requiredLength'
            }
        },
        { errorKey: 'required' },
        { errorKey: 'pattern' }
    ];

    static get(errorKey: string, error: any): ErrorFormatRule {
        const errorPlaceholder = ErrorFormatRuleLoader.errorFormatRule.find(x => x.errorKey === errorKey);
        if (errorPlaceholder) {
            return errorPlaceholder;
        }
        throw SyntaxError(`The ${errorKey} isn't a validation rule`);
    }
}

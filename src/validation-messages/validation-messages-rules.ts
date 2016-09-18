export class ValidationMessagesRules {
    constructor(private validationMessagesRules: any) {
    }

    getAttributePlaceHolder(attribute: string): string {
        if (this.containsCustomAttribute(attribute)) { // Custom has priority
            return this.getCustomAttributes(attribute);
        }
        return attribute;
    }

    getErrorMessage(errorKey: string): string {
        if (errorKey === 'customAttributes') {
            throw new SyntaxError('customAttributes is reserved');
        }
        return this.validationMessagesRules[errorKey];
    }

    private containsCustomAttribute(attribute: string): boolean {
        return !!this.getCustomAttributes(attribute);
    }

    private getCustomAttributes(attribute: string): string {
        return this.customAttributes[attribute];
    }

    private get customAttributes(): any {
        return this.validationMessagesRules['customAttributes'];
    }
}

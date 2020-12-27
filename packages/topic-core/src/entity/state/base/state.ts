import {
    AttributeStrategy,
    BasicAttributes,
    Disposable,
    Serializeable
} from '../../..';

export const BaseStateKeys = {
    value: "value",
}

export class BaseState implements Disposable, Serializeable {
    private attributes: AttributeStrategy;

    constructor(attributes: AttributeStrategy, value?: any) {
        this.attributes = attributes;

        this.setValue(value);
    }

    public getValue(): any {
        return this.attributes.get(BaseStateKeys.value);
    }

    public setValue(value: any): BaseState {
        this.attributes.set(BaseStateKeys.value, "any", value);

        return this;
    }

    public getAttributes(): AttributeStrategy {
        return this.attributes;
    }

    public setAttributeStrategy(attributes: AttributeStrategy) {
        this.attributes = attributes;
    }

    public serialize(): any {
        return this.attributes.serialize();
    }

    public dispose() {
        this.attributes.dispose();
        (this.attributes as any) = undefined;
    }

    static createBaseState<T>(initialValue?: T) {
        return new BaseState(BasicAttributes.create(), initialValue);
    }
}

import {
    AttributeStrategy,
    BasicAttributes,
    Deserializeable,
    Disposable,
    Observable,
    Serializeable,
    SubscriptionHandler,
    Unsubscribe,
} from '../../..';

export const BaseStateKeys = {
    value: 'value',
};

export type BaseStateEventData = {
    key: string;
    value: any;
};

export class BaseState
    implements
        Deserializeable,
        Disposable,
        Observable,
        Serializeable {
    private attributes: AttributeStrategy;

    constructor(attributes: AttributeStrategy, value?: any) {
        this.attributes = attributes;

        this.setValue(value);
    }

    public getValue(): any {
        return this.attributes.get(BaseStateKeys.value);
    }

    public setValue(value: any): BaseState {
        this.attributes.set(BaseStateKeys.value, 'any', value);

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

    public deserialize(payload: any): BaseState {
        this.attributes.deserialize(payload);

        return this;
    }

    public subscribe(
        eventName: string,
        handler: SubscriptionHandler,
    ): Unsubscribe {
        return this.attributes.subscribe(eventName, handler);
    }

    public dispose() {
        this.attributes.dispose();
        (this.attributes as any) = undefined;
    }

    static createBaseState<T>(initialValue?: T) {
        return new BaseState(BasicAttributes.create(), initialValue);
    }
}

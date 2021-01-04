import {
    AttributeStrategy,
    BasicAttributes,
    Deserializeable,
    Disposable,
    Observable,
    Path,
    Readable,
    Serializeable,
    SubscriptionHandler,
    Unsubscribe,
    Writeable,
} from '../../..';

export const BaseStateKeys = {
    value: "value",
    valid: "valid",
    message: "message",
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
        Readable,
        Serializeable,
        Writeable {
    private attributes: AttributeStrategy;

    constructor(attributes: AttributeStrategy, value?: any) {
        this.attributes = attributes;

        this.setValue(value);
        this.attributes.set(BaseStateKeys.valid, "boolean", true);
        this.attributes.set(BaseStateKeys.message, "string", null);
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

    public get(key: Path): any {
        const path: string = key as string;

        return this.getAttributes().get(path);
    }

    public set(key: Path, value: any): any {
        const path: string = key as string;

        this.getAttributes().set(path, 'any', value);
    }

    public dispose() {
        this.attributes.dispose();
        (this.attributes as any) = undefined;
    }

    static createBaseState<T>(initialValue?: T) {
        return new BaseState(BasicAttributes.create(), initialValue);
    }
}

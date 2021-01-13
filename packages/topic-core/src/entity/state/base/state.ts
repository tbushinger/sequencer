import {
    AttributeStrategy,
    BasicAttributes,
    BulkItems,
    BulkWriteable,
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
    value: 'value',
    valid: 'valid',
    message: 'message',
};

export type BaseStateEventData = {
    key: string;
    value: any;
};

export class BaseState
    implements
        BulkWriteable,
        Deserializeable,
        Disposable,
        Observable,
        Readable,
        Serializeable,
        Writeable {
    private attributes: AttributeStrategy;

    constructor(attributes: AttributeStrategy, value?: any) {
        this.attributes = attributes;

        this.setMany([
            { path: BaseStateKeys.valid, value: true, type: 'boolean' },
            { path: BaseStateKeys.message, value: null, type: 'string' },
            { path: BaseStateKeys.value, value },
        ]);
    }

    public serialize(): any {
        return this.attributes.serialize();
    }

    public deserialize(payload: any): BaseState {
        this.attributes.deserialize(payload);

        return this;
    }

    public subscribe(name: string, handler: SubscriptionHandler): Unsubscribe {
        return this.attributes.subscribe(name, handler);
    }

    public get(name: Path): any {
        return this.attributes.get(name);
    }

    public set(name: Path, value: any): any {
        this.attributes.set(name, value);
    }

    public setMany(items: BulkItems): any {
        this.attributes.setMany(items);
    }

    public dispose() {
        this.attributes.dispose();
        (this.attributes as any) = undefined;
    }

    static createBaseState<T>(initialValue?: T) {
        return new BaseState(BasicAttributes.create(), initialValue);
    }
}

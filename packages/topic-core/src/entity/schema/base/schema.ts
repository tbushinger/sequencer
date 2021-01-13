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
} from '../../../';

export const BaseSchemaKeys = {
    name: 'name',
    required: 'required',
};

export type BaseSchemaEventData = {
    key: string;
    value: any;
};

export class BaseSchema
    implements
        BulkWriteable,
        Deserializeable,
        Disposable,
        Observable,
        Readable,
        Serializeable,
        Writeable {
    private attributes: AttributeStrategy;

    constructor(attributes: AttributeStrategy, name?: string) {
        this.attributes = attributes;

        this.setMany([
            { path: BaseSchemaKeys.required, value: false, type: 'boolean' },
            { path: BaseSchemaKeys.name, value: name, type: 'string' },
        ]);
    }

    public serialize(): any {
        return this.attributes.serialize();
    }

    public deserialize(payload: any): BaseSchema {
        this.attributes.deserialize(payload);

        return this;
    }

    public subscribe(
        eventName: string,
        handler: SubscriptionHandler,
    ): Unsubscribe {
        return this.attributes.subscribe(eventName, handler);
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

    static createBaseSchema(name: string) {
        return new BaseSchema(BasicAttributes.create(), name);
    }
}

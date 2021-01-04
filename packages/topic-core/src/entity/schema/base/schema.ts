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
    Writeable
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
        Deserializeable,
        Disposable,
        Observable,
        Readable,
        Serializeable,
        Writeable {
    private attributes: AttributeStrategy;

    constructor(attributes: AttributeStrategy, name?: string) {
        this.setAttributeStrategy(attributes);

        this.attributes.set(BaseSchemaKeys.name, 'string', name);
        this.attributes.set(BaseSchemaKeys.required, "boolean", false);
    }

    public getName(): string | undefined {
        return this.attributes.get(BaseSchemaKeys.name);
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

    static createBaseSchema(name: string) {
        return new BaseSchema(BasicAttributes.create(), name);
    }
}

import {
    AttributeStrategy,
    BasicAttributes,
    Deserializeable,
    Disposable,
    Serializeable,
} from '../../../';

export const BaseSchemaKeys = {
    name: 'name',
};

export class BaseSchema implements Deserializeable, Disposable, Serializeable {
    private attributes: AttributeStrategy;

    constructor(attributes: AttributeStrategy, name?: string) {
        this.setAttributeStrategy(attributes);

        this.attributes.set(BaseSchemaKeys.name, 'string', name);
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

    public dispose() {
        this.attributes.dispose();
        (this.attributes as any) = undefined;
    }

    static createBaseSchema(name: string) {
        return new BaseSchema(BasicAttributes.create(), name);
    }
}

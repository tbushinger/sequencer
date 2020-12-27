import {
    AttributeStrategy,
    BasicAttributes,
    Disposable,
    Serializeable,
} from '../../../';

export const BaseSchemaKeys = {
    name: "name",
};

export class BaseSchema implements Disposable, Serializeable {
    private attributes: AttributeStrategy;

    constructor(attributes: AttributeStrategy, name?: string) {
        this.setAttributeStrategy(attributes);

        this.attributes.set(BaseSchemaKeys.name, "string", name);
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

    public dispose() {
        this.attributes.dispose();
        (this.attributes as any) = undefined;
    }

    static createBaseSchema(name: string) {
        return new BaseSchema(BasicAttributes.create(), name);
    }
}

import { has } from 'lodash';
import {
    BasicAttributesDeserializationStrategy,
    BasicAttributesSerializationStrategy,
    DeserializationStrategy,
    SerializationStrategy,
} from '../../';
import { Attributes, AttributeType } from '../../../types/attribute';
import { AttributeStrategy } from '../attribute';

export class BasicAttributes implements AttributeStrategy {
    private attributes: Attributes;
    private serializer: SerializationStrategy;
    private deserializer: DeserializationStrategy;

    constructor(
        deserializer: DeserializationStrategy,
        serializer: SerializationStrategy,
    ) {
        this.setDeserializer(deserializer);
        this.setSerializer(serializer);
        this.attributes = {};
    }

    public set(name: string, type: AttributeType, value: any): BasicAttributes {
        this.attributes[name] = { type, value };

        return this;
    }

    public has(name: string): boolean {
        return has(this.attributes, name);
    }

    public get(name: string): any | undefined {
        return this.has(name) ? this.attributes[name].value : undefined;
    }

    public getType(name: string): AttributeType | undefined {
        return this.has(name) ? this.attributes[name].type : undefined;
    }

    public serialize(): any {
        return this.serializer.serialize(this.attributes);
    }

    public deserialize(payload: any): BasicAttributes {
        this.deserializer.deserialize(this, payload);

        return this;
    }

    public setSerializer(serializer: SerializationStrategy): void {
        this.serializer = serializer;
    }

    public setDeserializer(deserializer: DeserializationStrategy): void {
        this.deserializer = deserializer;
    }

    public dispose() {
        this.attributes = {};
    }

    static create(): BasicAttributes {
        return new BasicAttributes(
            BasicAttributesDeserializationStrategy.create(),
            BasicAttributesSerializationStrategy.create(),
        );
    }
}

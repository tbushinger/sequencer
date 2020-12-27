import { has } from 'lodash';
import { Attributes, AttributeType } from '../../../types/attribute';
import {
    BasicAttributesSerializationStrategy,
    SerializationStrategy,
} from '../../serialization';
import { AttributeStrategy } from '../attribute';

export class BasicAttributes implements AttributeStrategy {
    private attributes: Attributes;
    private serializer: SerializationStrategy;

    constructor(serializer: SerializationStrategy) {
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
        return this.serializer.serialize<Attributes>(this.attributes);
    }

    public setSerializer(serializer: SerializationStrategy): void {
        this.serializer = serializer;
    }

    public dispose() {
        this.attributes = {};
    }

    static create(): BasicAttributes {
        return new BasicAttributes(
            BasicAttributesSerializationStrategy.create(),
        );
    }
}

import { get, set } from 'lodash';
import { SerializationStrategy } from '../serializer';

export class BasicAttributesSerializationStrategy
    implements SerializationStrategy {
    public serialize<Attributes>(attributes: Attributes): any {
        return Object.keys(attributes).reduce(
            (acc: any, name: string): any =>
                set(acc, name, get(attributes, [name, "value"])),
            {},
        );
    }

    static create(): BasicAttributesSerializationStrategy {
        return new BasicAttributesSerializationStrategy();
    }
}

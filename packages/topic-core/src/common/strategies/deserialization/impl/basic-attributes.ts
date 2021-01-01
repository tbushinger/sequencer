import { AttributeStrategy } from '../../attributes';
import { DeserializationStrategy } from '../deserializer';

export class BasicAttributesDeserializationStrategy
    implements DeserializationStrategy {
    public deserialize(attributes: AttributeStrategy, payload: any): void {
        Object.keys(payload).forEach((key: string) => {
            attributes.set(key, 'any', payload[key]);
        });
    }

    static create(): BasicAttributesDeserializationStrategy {
        return new BasicAttributesDeserializationStrategy();
    }
}

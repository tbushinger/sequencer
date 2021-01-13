import {
    AttributeStrategy,
    BulkItems,
    DeserializationStrategy,
} from '../../../';

export class BasicAttributesDeserializationStrategy
    implements DeserializationStrategy {
    public deserialize(attributes: AttributeStrategy, payload: any): void {
        const items: BulkItems = Object.keys(payload).map((key: string) => ({
            path: key,
            value: payload[key],
        }));

        attributes.setMany(items);
    }

    static create(): BasicAttributesDeserializationStrategy {
        return new BasicAttributesDeserializationStrategy();
    }
}

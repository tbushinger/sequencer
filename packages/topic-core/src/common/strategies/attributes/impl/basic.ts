import { has, last } from 'lodash';
import {
    Attributes,
    AttributeStrategy,
    AttributeType,
    BasicAttributesDeserializationStrategy,
    BasicAttributesSerializationStrategy,
    BasicKeyValueObservableStrategy,
    BulkItem,
    BulkItems,
    DeserializationStrategy,
    ObservableStrategy,
    SerializationStrategy,
    SubscriptionHandler,
    Unsubscribe,
} from '../../../';

export class BasicAttributes implements AttributeStrategy {
    private attributes: Attributes;
    private serializer: SerializationStrategy;
    private deserializer: DeserializationStrategy;
    private events: ObservableStrategy;

    constructor(
        deserializer: DeserializationStrategy,
        serializer: SerializationStrategy,
        eventStrategy: ObservableStrategy,
    ) {
        this.setDeserializer(deserializer);
        this.setSerializer(serializer);
        this.setObservableStrategy(eventStrategy);
        this.attributes = {};
    }

    private _upsert(
        name: string,
        value: any,
        type: AttributeType = 'any',
    ): void {
        if (this.has(name)) {
            this.attributes[name].value = value;
        }

        this.setWithType(name, type, value);
    }

    public setWithType(name: string, type: AttributeType, value: any): void {
        this.attributes[name] = { type, value };
    }

    public set(name: string, value: any): void {
        this._upsert(name, value);

        this.events.emit(name, {
            target: {
                value,
                name,
            },
        });
    }

    public setMany(items: BulkItems): any {
        if (!items.length) {
            return;
        }

        items.forEach((item: BulkItem) => {
            const { path, value, type } = item;
            this._upsert(path as string, value, type);
        });

        const { path, value } = last(items) as BulkItem;
        this.events.emit(path as string, {
            target: {
                value,
                name: path as string,
            },
        });
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

    public setObservableStrategy(eventStrategy: ObservableStrategy): void {
        this.events = eventStrategy;
    }

    public subscribe(name: string, handler: SubscriptionHandler): Unsubscribe {
        return this.events.subscribe(name, handler);
    }

    public dispose() {
        this.attributes = {};
        this.events.dispose();
    }

    static create(): BasicAttributes {
        return new BasicAttributes(
            BasicAttributesDeserializationStrategy.create(),
            BasicAttributesSerializationStrategy.create(),
            BasicKeyValueObservableStrategy.create(),
        );
    }
}

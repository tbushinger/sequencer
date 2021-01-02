import { has } from 'lodash';
import {
    Attributes,
    AttributeStrategy,
    AttributeType,
    BasicAttributesDeserializationStrategy,
    BasicAttributesSerializationStrategy,
    BasicKeyValueObservableStrategy,
    DeserializationStrategy,
    Observable,
    ObservableStrategy,
    SerializationStrategy,
    SubscriptionHandler,
    Unsubscribe,
} from '../../../';

export class BasicAttributes implements AttributeStrategy, Observable {
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

    public set(name: string, type: AttributeType, value: any): void {
        this.attributes[name] = { type, value };

        this.events.emit(name, {
            target: {
                value,
                name,
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

    public subscribe(key: string, handler: SubscriptionHandler): Unsubscribe {
        return this.events.subscribe(key, handler);
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

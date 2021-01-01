import { BaseSchema, BaseState } from "..";
import {
    Deserializeable,
    Disposable,
    Serializeable
} from "../..";

export type BaseEntitySerializer = (schema: BaseSchema, state: BaseState) => any;
export type BaseEntityDeserializer = (schema: BaseSchema, state: BaseState, payload: any) => any;

export class BaseEntity implements Deserializeable, Disposable, Serializeable {
    private schema: BaseSchema;
    private state: BaseState;
    private serializer: BaseEntitySerializer;
    private deserializer: BaseEntityDeserializer;

    constructor(
        schema: BaseSchema,
        state: BaseState,
        deserializer: BaseEntityDeserializer,
        serializer: BaseEntitySerializer,
    ) {
        this.schema = schema;
        this.state = state;
        this.setDeserializer(deserializer);
        this.setSerializer(serializer);
    }

    public getSchema(): BaseSchema {
        return this.schema;
    }

    public getState(): BaseState {
        return this.state;
    }

    public setDeserializer(deserializer: BaseEntityDeserializer): BaseEntity {
        this.deserializer = deserializer;
        return this;
    }

    public setSerializer(serializer: BaseEntitySerializer): BaseEntity {
        this.serializer = serializer;
        return this;
    }

    deserialize(payload: any): BaseEntity {
        this.deserializer(
            this.getSchema(),
            this.getState(),
            payload,
        );

        return this;
    }

    serialize(): any {
        return this.serializer(
            this.getSchema(),
            this.getState(),
        );
    }

    dispose(): void {
        this.schema.dispose();
        this.state.dispose();
        (this.schema as any) = undefined;
        (this.state as any) = undefined;
        (this.serializer as any) = undefined;
    }

    static createBaseEntity(
        type: string,
        initialValue: any,
    ) {
        return new BaseEntity(
            BaseSchema.createBaseSchema(type),
            BaseState.createBaseState(initialValue),
            (schema, state, payload) => {
                if (payload.schema) {
                    schema.deserialize(payload.schema);
                }
                if (payload.state) {
                    state.deserialize(payload.state);
                }
            },
            (schema, state) => {
                return {
                    schema: schema.serialize(),
                    state: state.serialize(),
                }
            }
        )
    }
}
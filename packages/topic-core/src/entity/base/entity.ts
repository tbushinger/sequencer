import { BaseSchema, BaseState } from "..";
import {
    Disposable,
    Serializeable
} from "../..";

export type BaseEntitySerializer = (schema: BaseSchema, state: BaseState) => any;

export class BaseEntity implements Disposable, Serializeable {
    private schema: BaseSchema;
    private state: BaseState;
    private serializer: BaseEntitySerializer;

    constructor(
        schema: BaseSchema,
        state: BaseState,
        serializer: BaseEntitySerializer,
    ) {
        this.schema = schema;
        this.state = state;
        this.setSerializer(serializer);
    }

    public getSchema(): BaseSchema {
        return this.schema;
    }

    public getState(): BaseState {
        return this.state;
    }

    public setSerializer(serializer: BaseEntitySerializer): BaseEntity {
        this.serializer = serializer;
        return this;
    }

    serialize(): any {
        return this.serializer(
            this.getSchema(),
            this.getState(),
        )
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
            (schema, state) => {
                return {
                    schema: schema.serialize(),
                    state: state.serialize(),
                }
            }
        )
    }
}
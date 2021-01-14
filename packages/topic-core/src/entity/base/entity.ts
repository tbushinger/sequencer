import { isNull, isUndefined } from 'lodash';
import {
    BaseSchema,
    BaseSchemaKeys,
    BaseState,
    BaseStateKeys,
    BasicExecuteableStrategy,
    BulkItems,
    BulkWriteable,
    Command,
    Deserializeable,
    Disposable,
    Executeable,
    ExecuteableStrategy,
    isNil,
    Observable,
    Path,
    Readable,
    Serializeable,
    SubscriptionHandler,
    Unsubscribe,
    Writeable,
} from '../../';

export type BaseEntitySerializer = (
    schema: BaseSchema,
    state: BaseState,
) => any;

export type BaseEntityDeserializer = (
    schema: BaseSchema,
    state: BaseState,
    payload: any,
) => any;

export const BaseEntityCommands = {
    validate: 'validate',
    initialize: 'initialize',
};

export class BaseEntity
    implements
        BulkWriteable,
        Deserializeable,
        Disposable,
        Executeable,
        Observable,
        Readable,
        Serializeable,
        Writeable {
    private schema: BaseSchema;
    private state: BaseState;
    private serializer: BaseEntitySerializer;
    private deserializer: BaseEntityDeserializer;
    private executeableStrategy: ExecuteableStrategy;

    constructor(
        schema: BaseSchema,
        state: BaseState,
        deserializer: BaseEntityDeserializer,
        serializer: BaseEntitySerializer,
        executeableStrategy: ExecuteableStrategy,
    ) {
        this.schema = schema;
        this.state = state;
        this.deserializer = deserializer;
        this.serializer = serializer;
        this.executeableStrategy = executeableStrategy;
    }

    public getSchema(): BaseSchema {
        return this.schema;
    }

    public getState(): BaseState {
        return this.state;
    }

    public executeables(): ExecuteableStrategy {
        return this.executeableStrategy;
    }

    deserialize(payload: any): BaseEntity {
        this.deserializer(this.getSchema(), this.getState(), payload);

        return this;
    }

    serialize(): any {
        return this.serializer(this.getSchema(), this.getState());
    }

    public subscribe(path: string, handler: SubscriptionHandler): Unsubscribe {
        return this.getState().subscribe(path, handler);
    }

    public set(path: Path, value: any): void {
        this.getState().set(path, value);
    }

    public setMany(items: BulkItems): any {
        this.getState().setMany(items);
    }

    public get(path: Path): any {
        return this.getState().get(path);
    }

    public execute(commandName: string): void {
        this.executeableStrategy.execute(commandName, this);
    }

    public dispose(): void {
        this.schema.dispose();
        this.state.dispose();
        this.executeableStrategy.dispose();
        (this.schema as any) = undefined;
        (this.state as any) = undefined;
        (this.serializer as any) = undefined;
        (this.executeableStrategy as any) = undefined;
    }

    static createBaseEntity(type: string, initialValue: any) {
        const entity = new BaseEntity(
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
                };
            },
            BasicExecuteableStrategy.create(),
        );

        const validateCommand: Command = (e: BaseEntity) => {
            const required: boolean = e
                .getSchema()
                .get(BaseSchemaKeys.required);
            const value: any = e.get(BaseStateKeys.value);

            let message: string | null = null;
            let valid: boolean = true;
            if (required && isNil(value)) {
                const name = e.getSchema().get(BaseSchemaKeys.name);
                message = `${name} is required.`;
                valid = false;
            }

            e.setMany([
                { path: BaseStateKeys.message, value: message },
                { path: BaseStateKeys.valid, value: valid },
            ]);
        };

        const initializeCommand: Command = (e: BaseEntity) => {
            const defaultValue: any = e
                .getSchema()
                .get(BaseSchemaKeys.defaultValue);
            const value: any = e.get(BaseStateKeys.value);

            if (
                isNull(defaultValue) ||
                isUndefined(defaultValue) ||
                !isNull(value)
            ) {
                return;
            }

            e.set(BaseStateKeys.value, defaultValue);
        };

        entity
            .executeables()
            .addCommand(BaseEntityCommands.validate, validateCommand);

        entity
            .executeables()
            .addCommand(BaseEntityCommands.initialize, initializeCommand);

        return entity;
    }
}

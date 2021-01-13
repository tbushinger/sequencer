import {
    BaseSchema,
    BaseState,
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
            const required: boolean = e.getSchema().get('required');
            const value: any = e.get('value');

            if (required && isNil(value)) {
                const name = e.getSchema().get('name');
                e.setMany([
                    { path: 'message', value: `${name} is required.` },
                    { path: 'valid', value: false },
                ]);
            } else {
                e.setMany([
                    { path: 'message', value: null },
                    { path: 'valid', value: true },
                ]);
            }
        };

        entity
            .executeables()
            .addCommand(BaseEntityCommands.validate, validateCommand);

        return entity;
    }
}

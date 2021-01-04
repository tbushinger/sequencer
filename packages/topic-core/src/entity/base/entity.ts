import {
    AttributeStrategy,
    BaseSchema,
    BaseSchemaKeys,
    BaseState,
    BaseStateKeys,
    BasicExecuteableStrategy,
    Command,
    Deserializeable,
    Disposable,
    Executeable,
    ExecuteableStrategy,
    isNil,
    Observable,
    Path,
    PathPart,
    Readable,
    Serializeable,
    SubscriptionHandler,
    toPath,
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
        this.setDeserializer(deserializer);
        this.setSerializer(serializer);
        this.executeableStrategy = executeableStrategy;
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

    public setExecuteableStrategy(
        executeableStrategy: ExecuteableStrategy,
    ): BaseEntity {
        this.executeableStrategy = executeableStrategy;
        return this;
    }

    public getExecuteableStrategy(): ExecuteableStrategy {
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
        const pathParts: PathPart[] = toPath(path);
        const [type, key = '*'] = pathParts;

        if (type === 'schema') {
            return this.getSchema().subscribe(key as string, handler);
        } else {
            return this.getState().subscribe(key as string, handler);
        }
    }

    public set(path: Path, value: any): void {
        const pathParts: PathPart[] = toPath(path);
        if (pathParts.length < 2) {
            return;
        }

        const [type, key] = pathParts;
        if (type === 'schema') {
            this.getSchema()
                .getAttributes()
                .set(key as string, 'any', value);
        } else {
            this.getState()
                .getAttributes()
                .set(key as string, 'any', value);
        }
    }

    public get(path: Path): any {
        const pathParts: PathPart[] = toPath(path);
        if (pathParts.length < 2) {
            return;
        }

        const [type, key] = pathParts;
        if (type === 'schema') {
            return this.getSchema()
                .getAttributes()
                .get(key as string);
        } else {
            return this.getState()
                .getAttributes()
                .get(key as string);
        }
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
            const schemaAttrs: AttributeStrategy = e
                .getSchema()
                .getAttributes();
            const stateAttrs: AttributeStrategy = e.getState().getAttributes();
            const required: boolean = schemaAttrs.get(BaseSchemaKeys.required);
            const value: any = stateAttrs.get(BaseStateKeys.value);

            // TODO: add some type of transaction to turn off update notifications
            if (required && isNil(value)) {
                const name = e.getSchema().getName();
                stateAttrs.set(
                    BaseStateKeys.message,
                    'string',
                    `${name} is required.`,
                );
                stateAttrs.set(BaseStateKeys.valid, 'boolean', false);
            } else {
                stateAttrs.set(BaseStateKeys.message, 'string', null);
                stateAttrs.set(BaseStateKeys.valid, 'boolean', true);
            }
        };

        entity
            .getExecuteableStrategy()
            .addCommand(BaseEntityCommands.validate, validateCommand);

        return entity;
    }
}

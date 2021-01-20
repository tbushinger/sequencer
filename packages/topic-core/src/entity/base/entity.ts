import {
    BaseSchema,
    BaseState,
    BasicExecuteableStrategy,
    BulkItems,
    BulkWriteable,
    Deserializeable,
    Disposable,
    Executeable,
    ExecuteableStrategy,
    Observable,
    Path,
    Readable,
    Serializeable,
    SubscriptionHandler,
    Unsubscribe,
    Writeable,
} from '../../';
import { deserialize, initialize, serialize, validate } from './commands';

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
    deserialize: 'deserialize',
    serialize: 'serialize',
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
    private executeableStrategy: ExecuteableStrategy;

    constructor(
        schema: BaseSchema,
        state: BaseState,
        executeableStrategy: ExecuteableStrategy,
    ) {
        this.schema = schema;
        this.state = state;
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
        (this.execute(BaseEntityCommands.deserialize) as any)(payload);

        return this;
    }

    serialize(): any {
        return (this.execute(BaseEntityCommands.serialize) as any)();
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

    public execute(commandName: string): any {
        return this.executeableStrategy.execute(commandName, this);
    }

    public dispose(): void {
        this.schema.dispose();
        this.state.dispose();
        this.executeableStrategy.dispose();
        (this.schema as any) = undefined;
        (this.state as any) = undefined;
        (this.executeableStrategy as any) = undefined;
    }

    static createBaseEntity(type: string, initialValue: any) {
        const entity = new BaseEntity(
            BaseSchema.createBaseSchema(type),
            BaseState.createBaseState(initialValue),
            BasicExecuteableStrategy.create(),
        );

        entity
            .executeables()
            .addCommand(BaseEntityCommands.validate, validate)
            .addCommand(BaseEntityCommands.initialize, initialize)
            .addCommand(BaseEntityCommands.deserialize, deserialize)
            .addCommand(BaseEntityCommands.serialize, serialize);

        return entity;
    }
}

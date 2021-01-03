import {
    BaseSchema,
    BaseState,
    Deserializeable,
    Disposable,
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

export class BaseEntity
    implements
        Deserializeable,
        Disposable,
        Observable,
        Readable,
        Serializeable,
        Writeable {
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

    dispose(): void {
        this.schema.dispose();
        this.state.dispose();
        (this.schema as any) = undefined;
        (this.state as any) = undefined;
        (this.serializer as any) = undefined;
    }

    static createBaseEntity(type: string, initialValue: any) {
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
                };
            },
        );
    }
}

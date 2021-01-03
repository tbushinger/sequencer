import { assert } from 'chai';
import { BaseEntity } from './entity';

describe('entity/base/entity', () => {
    const type = 'MyEntity';
    const value = 'myValue';
    const entity: BaseEntity = BaseEntity.createBaseEntity(type, value);

    describe('object', () => {
        it('entity should have been created', () => {
            assert.isDefined(entity);
        });
    });

    describe('getSchema', () => {
        it('should return name', () => {
            const result = entity.getSchema().getName();
            assert.equal(type, result);
        });
    });

    describe('getState', () => {
        it('should return value', () => {
            const result = entity.getState().getValue();
            assert.equal(value, result);
        });
    });

    describe('serialize', () => {
        it('should return default serialized structure', () => {
            const result = entity.serialize();
            const expected = {
                schema: {
                    name: type,
                },
                state: {
                    value,
                },
            };

            assert.deepEqual(expected, result);
        });
    });

    describe('deserialize', () => {
        it('should return default serialized structure', () => {
            const input = {
                schema: {
                    name: type,
                },
                state: {
                    value,
                },
            };

            entity.deserialize(input);
            const result = entity.serialize();
            const expected = {
                schema: {
                    name: type,
                },
                state: {
                    value,
                },
            };

            assert.deepEqual(expected, result);
        });
    });

    describe('subscribe', () => {
        it('should fire schema event with proper payload', done => {
            const expected: any = {
                target: { value: 'someValue', name: 'myObservedKey' },
            };

            const unsub = entity.subscribe('schema', event => {
                if (event.target.name === 'myObservedKey') {
                    assert.deepEqual(event, expected);
                    unsub();
                    done();
                }
            });

            entity
                .getSchema()
                .getAttributes()
                .set('myObservedKey', 'string', 'someValue');
        });

        it('should fire state event with proper payload', done => {
            const expected: any = {
                target: { value: 'someValue', name: 'myObservedKey' },
            };

            const unsub = entity.subscribe('state.myObservedKey', event => {
                assert.deepEqual(event, expected);
                unsub();
                done();
            });

            entity
                .getState()
                .getAttributes()
                .set('myObservedKey', 'string', 'someValue');
        });
    });

    describe('get/set', () => {
        it('should properly set/get schema value', () => {
            entity.set(['schema', 'mySchemaKey'], 'mySchemaValue');

            const result = entity.get('schema.mySchemaKey');

            assert.equal(result, 'mySchemaValue');
        });

        it('should properly set/get state value', () => {
            entity.set(['state', 'myStateKey'], 'myStateValue');

            const result = entity.get('state.myStateKey');

            assert.equal(result, 'myStateValue');
        });
    });

    describe('dispose', () => {
        it('should properly dispose', () => {
            entity.dispose();

            const result = entity.getSchema();

            assert.isUndefined(result);
        });
    });
});

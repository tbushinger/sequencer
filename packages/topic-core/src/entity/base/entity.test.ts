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
            const result = entity.getSchema().get("name");
            assert.equal(type, result);
        });
    });

    describe('getState', () => {
        it('should return value', () => {
            const result = entity.get("value");
            assert.equal(value, result);
        });
    });

    describe('serialize', () => {
        it('should return default serialized structure', () => {
            const result = entity.serialize();
            const expected = {
                schema: {
                    name: type,
                    required: false,
                },
                state: {
                    value,
                    valid: true,
                    message: null,
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
                    required: false,
                },
                state: {
                    value,
                    valid: true,
                    message: null,
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

            const unsub = entity.getSchema().subscribe('*', event => {
                if (event.target.name === 'myObservedKey') {
                    assert.deepEqual(event, expected);
                    unsub();
                    done();
                }
            });

            entity
                .getSchema()
                .set('myObservedKey', 'someValue');
        });

        it('should fire state event with proper payload', done => {
            const expected: any = {
                target: { value: 'someValue', name: 'myObservedKey' },
            };

            const unsub = entity.subscribe('myObservedKey', event => {
                assert.deepEqual(event, expected);
                unsub();
                done();
            });

            entity
                .getState()
                .set('myObservedKey', 'someValue');
        });
    });

    describe('get/set', () => {
        it('should properly set/get state value', () => {
            entity.set('myStateKey', 'myStateValue');

            const result = entity.get('myStateKey');

            assert.equal(result, 'myStateValue');
        });
    });

    describe('execute - validate', () => {
        it('state have proper invalid attributes', done => {

            const unsub = entity.subscribe('valid', () => {
                const result: any = entity.getState().serialize();

                assert.equal(result.valid, false);
                assert.equal(result.message, "MyEntity is required.");

                unsub();
                done();
            });

            entity.getSchema().set("required", true);
            entity.getState().set("value", null);
            entity.execute("validate");
        });

        it('state have proper valid attributes', done => {
            const unsub = entity.subscribe('valid', () => {
                const result: any = entity.getState().serialize();

                assert.equal(result.valid, true);
                assert.equal(result.message, null);

                unsub();
                done();
            });

            entity.getSchema().set("required", true);
            entity.set("value", "my Value");
            entity.execute("validate");
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

import { assert } from 'chai';
import { BaseSchema } from './schema';

describe('entity/schema/base', () => {
    const name = 'MySchema';
    const schema: BaseSchema = BaseSchema.createBaseSchema(name);

    describe('object', () => {
        it('schema should have been created', () => {
            assert.isDefined(schema);
        });
    });

    describe('attributes', () => {
        it('should get attribute', () => {
            assert.equal(schema.get('name'), name);
        });

        it('should set attribute', () => {
            schema.set('other', 'other');

            assert.equal(schema.get('other'), 'other');
        });
    });

    describe('serialize', () => {
        it('should return serialized attributes', () => {
            const result: any = schema.serialize();
            const expected: any = {
                name,
                other: 'other',
                required: false,
            };

            assert.deepEqual(result, expected);
        });
    });

    describe('deserialize', () => {
        it('should return should property attributes', () => {
            const input: any = {
                name,
                other: 'other',
            };

            schema.deserialize(input);
            const result = schema.serialize();

            const expected: any = {
                name,
                other: 'other',
                required: false,
            };

            assert.deepEqual(result, expected);
        });
    });

    describe('subscribe', () => {
        it('should fire event with proper payload', done => {
            const expected: any = {
                target: { value: 'someValue', name: 'myObservedKey' },
            };

            const unsub = schema.subscribe('myObservedKey', event => {
                assert.deepEqual(event, expected);
                unsub();
                done();
            });

            schema.set('myObservedKey', 'someValue');
        });
    });

    describe('set/get', () => {
        it('should properly set and get a value', () => {
            schema.set('myKey', 'myValue');

            const result = schema.get('myKey');

            assert.equal(result, 'myValue');
        });
    });

    describe('dispose', () => {
        it('should properly dispose', () => {
            schema.dispose();
        });
    });
});

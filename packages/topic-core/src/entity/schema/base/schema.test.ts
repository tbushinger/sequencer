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

    describe('getName', () => {
        it('should return name', () => {
            assert.equal(schema.getName(), name);
        });
    });

    describe('attributes', () => {
        it('should get attribute', () => {
            assert.equal(schema.getAttributes().get('name'), name);
        });

        it('should set attribute', () => {
            schema.getAttributes().set('other', 'string', 'other');

            assert.equal(schema.getAttributes().get('other'), 'other');
        });
    });

    describe('serialize', () => {
        it('should return serialized attributes', () => {
            const result: any = schema.serialize();
            const expected: any = {
                name,
                other: 'other',
            };

            assert.deepEqual(result, expected);
        });
    });

    describe('dispose', () => {
        it('should properly dispose', () => {
            schema.dispose();

            const result = schema.getAttributes();

            assert.isUndefined(result);
        });
    });
});

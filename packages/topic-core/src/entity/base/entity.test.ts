import { assert } from 'chai';
import { BaseEntity } from './entity';

describe('entity/base/entity', () => {
    const type = 'MyEntity';
    const value = "myValue";
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
                }
            }

            assert.deepEqual(expected, result);
        });
    });
});

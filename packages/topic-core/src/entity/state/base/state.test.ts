import { assert } from 'chai';
import { BaseState } from './state';

describe('entity/state/base', () => {
    const value = "MyValue";
    const state: BaseState = BaseState.createBaseState(value);

    describe('object', () => {
        it('state should have been created', () => {
            assert.isDefined(state);
        });
    });

    describe('getValue', () => {
        it('should return value', () => {            
            assert.equal(state.getValue(), value);
        });
    });

    describe('attributes', () => {
        it('should get attribute', () => {            
            assert.equal(state.getAttributes().get("value"), value);
        });

        it('should set attribute', () => {            
            state.getAttributes().set("other", "string", "other");

            assert.equal(state.getAttributes().get("other"), "other");
        });
    });

    describe('serialize', () => {
        it('should return serialized attributes', () => {     
            const result: any = state.serialize();
            const expected: any = {
                value,
                other: "other",
            };

            assert.deepEqual(result, expected);
        });
    });

    describe('dispose', () => {
        it('should properly dispose', () => {     
            state.dispose();

            const result = state.getAttributes();

            assert.isUndefined(result);
        });
    });
});

import { assert } from 'chai';
import { BaseState } from './state';

describe('entity/state/base', () => {
    const value = 'MyValue';
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
            assert.equal(state.getAttributes().get('value'), value);
        });

        it('should set attribute', () => {
            state.getAttributes().set('other', 'string', 'other');

            assert.equal(state.getAttributes().get('other'), 'other');
        });
    });

    describe('serialize', () => {
        it('should return serialized attributes', () => {
            const result: any = state.serialize();
            const expected: any = {
                value,
                other: 'other',
                valid: true,
                message: null,
            };

            assert.deepEqual(result, expected);
        });
    });

    describe('deserialize', () => {
        it('should return serialized attributes', () => {
            const input: any = {
                value,
                other: 'other',
            };

            state.deserialize(input);
            const result: any = state.serialize();
            const expected: any = {
                value,
                other: 'other',
                valid: true,
                message: null,
            };

            assert.deepEqual(result, expected);
        });
    });

    describe('subscribe', () => {
        it('should fire event with proper payload', done => {
            const expected: any = {
                target: { value: 'someValue', name: 'myObservedKey' },
            };

            const unsub = state.subscribe('myObservedKey', event => {
                assert.deepEqual(event, expected);
                unsub();
                done();
            });

            state.getAttributes().set('myObservedKey', 'string', 'someValue');
        });
    });

    describe('set/get', () => {
        it('should properly set and get a value', () => {
            state.set('myKey', 'myValue');

            const result = state.get('myKey');

            assert.equal(result, 'myValue');
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

import { assert } from 'chai';
import { requestBus, responseBus } from ".";

describe("sequencer-bus-local", () => {
    it("should have request bus", () => {
        assert.isDefined(requestBus);
    });

    it("should have response bus", () => {
        assert.isDefined(responseBus);
    });
});

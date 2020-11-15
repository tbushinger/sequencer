import { assert } from 'chai';
import { createId, createTs } from "./ids";

describe("ids", () => {
    describe("createId", () => {
        it("should return id", () => {
            const result = createId();
            assert.isDefined(result);    
        });
    });

    describe("createTs", () => {
        it("should return timestamp", () => {
            const result = createTs();
            assert.isDefined(result);    
        });
    });
});

import { assert } from 'chai';
import { createMessage } from "./factory";
import { Message } from "../types";

describe("factory", () => {
    describe("createMessage", () => {
        it("should return message", () => {
            const result: Message = createMessage(
                "testUser",
                "myTopic",
                "myCommand",
                "some data"
            );

            assert.isDefined(result.id);
            assert.isDefined(result.ts);
            assert.equal(result.userId, "testUser");
            assert.equal(result.topic, "myTopic");
            assert.equal(result.command, "myCommand");
            assert.equal(result.data, "some data");
        });
    });
});

import { assert } from 'chai';
import { createMessage } from "../factory";
import { Message, Messages } from "../types";
import { count, dequeue, enqueue } from "./queue";

describe("factory", () => {
    describe("enqueue", () => {
        it("should return 1 message", () => {
            const message: Message = createMessage(
                "testUser",
                "myTopic",
                "myCommand",
                "some data"
            );

            const result: Messages = enqueue([], message);

            assert.lengthOf(result, 1);
        });
    });

    describe("count", () => {
        it("should return 1", () => {
            const message: Message = createMessage(
                "testUser",
                "myTopic",
                "myCommand",
                "some data"
            );

            const result: number = count([message]);
            
            assert.equal(result, 1);
        });
    });

    describe("dequeue", () => {
        it("should return 0 messages and one popped message", () => {
            const _message: Message = createMessage(
                "testUser",
                "myTopic",
                "myCommand",
                "some data"
            );

            const { message, messages } = dequeue([_message]);

            assert.lengthOf(messages, 0);
            assert.isDefined(message);
        });
    });
});

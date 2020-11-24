import { assert } from 'chai';
import { Message, createMessage } from "sequencer-models";
import { MessageBus } from "../types"
import { createLocalMessageBus } from "./local";

describe("test", () => {
    const bus: MessageBus = createLocalMessageBus();

    it("should create bus", () => {
        assert.isDefined(bus);
    });

    it("should return 1 message for single topic", (done) => {
        const message: Message = createMessage(
            "testUser",
            "myTopic",
            "myCommand",
            "some data"
        );

        bus.emit(message);

        const unsubscribe = bus.on((result: Message) => {
            assert.equal(result.data, message.data);
            unsubscribe();
            done();
        })

    })

    it("should return 2 messages", (done) => {
        let calls = 0;

        const message1: Message = createMessage(
            "testUser",
            "myTopic",
            "myCommand",
            "some data"
        );

        const message2: Message = createMessage(
            "testUser",
            "myTopic2",
            "myCommand",
            "some data"
        );

        const unsubscribe = bus.on((result: Message) => {
            assert.equal(result.data, message1.data);
            calls += 1;
        })

        bus.emit(message1);
        bus.emit(message2);

        setTimeout(() => {
            assert.equal(calls, 2);
            unsubscribe();
            done();
        }, 10);

    })
});

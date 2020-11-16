import { assert } from 'chai';
import { createLocalMessageBus } from "./local";
import { MessageBus } from "../types"
import { createMessage, Message } from "sequencer-models";

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

        const unsubscribe = bus.on("myTopic", (result: Message) => {
            assert.equal(result.topic, message.topic);
            unsubscribe();
            done();
        })

    })

    it("should return 1 message for 2 topics", (done) => {
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

        const unsubscribe1 = bus.on("myTopic", (result: Message) => {
            assert.equal(result.topic, message1.topic);
            unsubscribe1();
            calls += 1;
        })

        bus.emit(message1);
        bus.emit(message2);

        const unsubscribe2 = bus.on("myTopic2", (result2: Message) => {
            assert.equal(result2.topic, message2.topic);
            unsubscribe2();
            calls += 1;
        })

        setTimeout(() => {
            assert.equal(calls, 2);
            done();
        }, 10);

    })
});

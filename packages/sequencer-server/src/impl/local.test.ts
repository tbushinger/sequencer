import { assert } from 'chai';
import {
    MessageBus, createLocalMessageBus
} from "sequencer-bus";
import { Message, createMessage } from "sequencer-models";
import { SequencerServer } from "../types";
import LocalServer from "./local";

describe("LocalStore", () => {
    const storeName = "myStore";
    const commandName = "addVersion";
    const storeData = {
        id: "123",
        data: "my initial data",
    }

    const expected = {
        ...storeData,
        ...{
            version: "1.0.0"
        },
    };

    const responseBus: MessageBus = createLocalMessageBus();
    const requestBus: MessageBus = createLocalMessageBus();

    const server: SequencerServer = LocalServer.createServer(requestBus, responseBus);

    server
        .registerStore(storeName, { id: "123", data: "my initial data"})
        .registerCommand(storeName, commandName, (prev: any) => {
            return {
                ...prev,
                ...{
                    version: "1.0.0"
                },
            }
        });

    it("should have instance of service", () => {
        assert.isDefined(server);
    });

    it("should return proper updated data", (done) => {
        const message: Message = createMessage(
            "myUser",
            storeName,
            commandName,
            null,
        );

        const unsub = responseBus.on((m: Message) => {
            assert.deepEqual(m.data, expected);

            unsub();
            done();
        });

        requestBus.emit(message);
    });
});
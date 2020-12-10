import { assert } from 'chai';
import {
    requestBus,
    responseBus
} from "sequencer-bus-local";
import { SequencerClient } from "../types";
import LocalSequencerClient from "./local";

describe("LocalSequencerClient", () => {
    const topic = "myTopic";
    const payload = {
        id: "123",
        data: "my data",
    }

    const expected = {
        ...payload,
    };
   
    const client: SequencerClient = LocalSequencerClient.createClient("myUser");

    it("should have instance of service", () => {
        assert.isDefined(client);
    });

    it("should return proper data", (done) => {
        const unsubEchoBack = requestBus.on((msg) => {
            responseBus.emit(msg);
        });

        const unsub = client.response<any>(topic, (result) => {
            assert.deepEqual(result, expected);

            unsub();
            unsubEchoBack();
            done();
        });

        client.request(topic, "myCommand", payload);
    });
});
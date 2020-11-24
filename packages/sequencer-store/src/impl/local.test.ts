import { assert } from 'chai';
import { Message, createMessage } from "sequencer-models";
import { Store } from "../types"
import { createLocalStore } from "./local";

type MyModel = {
    id: string;
    data: string;
    version: string;
}

describe("LocalStore", () => {
    const store: Store<MyModel> = createLocalStore<MyModel>({
        id: "1",
        data: "initial text",
        version: "0.0.0",
    });

    store.registerCommand(
        "updateVersion",
        (model: MyModel, message: Message) =>
            Object.assign({}, model, { version: message.data }),
    );

    store.registerCommand(
        "updateData",
        (model: MyModel, message: Message) =>
            Object.assign({}, model, { data: message.data }),
    );

    it("should create Store", () => {
        assert.isDefined(store);
    });

    it("should update model version", (done) => {
        const message: Message = createMessage(
            "testUser",
            "myModal",
            "updateVersion",
            "1.0.0"
        );

        store.apply(message);

        const unsubscribe = store.onChange((result: MyModel) => {
            assert.equal(result.version, message.data);
            unsubscribe();
            done();
        });
    })
});

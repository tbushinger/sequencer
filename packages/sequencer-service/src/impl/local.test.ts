import { assert } from 'chai';
import {
    BusErrorCallback,
    BusSubscription,
    BusUnsubscribe,
    MessageBus,
} from "sequencer-bus";
import { Message, createMessage } from "sequencer-models";
import {
    Store,
    StoreCommand,
    StoreErrorCallback,
    StoreSubscription,
    StoreUnsubscribe,
} from "sequencer-store";
import { SequencerService } from "../types";
import { createLocalSequencerService } from "./local";

export class MockMessageBus implements MessageBus {
    private cb: any;

    public emit(message: Message): void {
        setTimeout(() => {
            this.cb(message)
        },1);
    }

    public on(subscription: BusSubscription): BusUnsubscribe {
        this.cb = subscription;

        return () => {
            this.cb = null;
        }
    }

    public onError(_errorCallback: BusErrorCallback): void {
        return;
    }
}

export class MockStore<T> implements Store<T> {
    private model: T;
    private cb: any;

    constructor(initial: T) {
        this.model = initial;
    }

    public registerCommand(_commandName: string, _command: StoreCommand<T>): void {
        return;
    }

    public apply(message: any): void {
        this.cb(this.model, message);
    }

    public onChange(subscription: StoreSubscription<T>): StoreUnsubscribe {
        this.cb = subscription;

        return () => {}
    }

    public getModel(): T {
        return this.model;
    }

    public onError(_errorCallback: StoreErrorCallback<T>): void {
        return;
    }
}

describe("LocalStore", () => {
    const topic = "myTopic";
    const responseBus: MessageBus = new MockMessageBus();
    const requestBus: MessageBus = new MockMessageBus();

    const store: Store<string> = new MockStore("some data");

    const service: SequencerService = createLocalSequencerService();

    const unsubTopic = service.register(topic, requestBus, responseBus, store);

    it("should create service", () => {
        assert.isDefined(service);
    });

    it("should return one topic", () => {
        const topics = service.getTopics();

        assert.lengthOf(topics, 1);
    });

    it("should emit 1 onchange message", (done) => {
        const message: Message = createMessage(
            "testUser",
            topic,
            "updateData",
            "updated Data"
        );

        requestBus.emit(message);

        const unsub = responseBus.on((result) => {
            assert.equal(result.command, "response")
            unsub();
            done();
        });
    });

    it("should return no topics on unsubscribe", () => {
        unsubTopic();
        const topics = service.getTopics();

        assert.lengthOf(topics, 0);
    });
});
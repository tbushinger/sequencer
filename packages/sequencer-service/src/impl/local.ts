import { BusUnsubscribe, MessageBus } from "sequencer-bus";
import {
    Message, createMessage
} from "sequencer-models";
import { Store, StoreUnsubscribe } from "sequencer-store";
import {
    SequencerService,
    UnsubscribeService
} from "../types";

type LocalServiceRegistry = {
    [topic: string]: {
        requestUnsubscribe: BusUnsubscribe;
        storeUnsubscribe: StoreUnsubscribe;
    };
};

export class LocalSequencerService implements SequencerService {
    private registry: LocalServiceRegistry = {};

    public register<T>(
        topic: string,
        requestBus: MessageBus,
        responseBus: MessageBus,
        store: Store<T>,
    ): UnsubscribeService {
        const requestUnsubscribe =  requestBus.on((message: Message) => {
            if (message.topic === topic) {
                store.apply(message);
            }
        });

        const storeUnsubscribe = store.onChange((data: T, message: Message) => {
            if (message.topic === topic) {
                responseBus.emit(createMessage(
                    message.userId,
                    topic,
                    "response",
                    data,
                ));
            }
        })

        this.registry[topic] = {
            requestUnsubscribe,
            storeUnsubscribe,
        };

        return () => {
            requestUnsubscribe();
            storeUnsubscribe();
            delete this.registry[topic];
        }
    }

    public getTopics(): string[] {
        return Object.keys(this.registry);
    }
}

let instance: SequencerService;

export function createLocalSequencerService(): SequencerService {
    if (instance) {
        return instance;
    }

    instance = new LocalSequencerService();

    return instance;
}
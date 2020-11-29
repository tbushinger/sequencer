import { MessageBus } from "sequencer-bus";
import {
    SequencerService,
    UnsubscribeService,
    createLocalSequencerService,
} from "sequencer-service";
import {
    Store,
    StoreCommand,
    createLocalStore,
} from "sequencer-store";
import { SequencerServer } from "../types";

type TopicServices = {
    [topic: string]: {
        unsubscribeService: UnsubscribeService;
        store: Store<any>;
    };
}

export default class LocalSequencerServer implements SequencerServer {
    private static instance: SequencerServer;
    private serviceFactory: SequencerService;
    private services: TopicServices = {};
    private requestMessageBusRef: MessageBus;
    private responseMessageBusRef: MessageBus;

    constructor(
        requestMessageBusRef: MessageBus,
        responseMessageBusRef: MessageBus,
    ) {
        this.serviceFactory = createLocalSequencerService();
        this.requestMessageBusRef = requestMessageBusRef;
        this.responseMessageBusRef = responseMessageBusRef;
    }

    public registerStore<T>(
        topic: string,
        initialData: T,
    ): SequencerServer {
        const store: Store<T> = createLocalStore<T>(initialData);

        this.services[topic] = {
            store,
            unsubscribeService: this.serviceFactory.register<T>(
                topic,
                this.requestMessageBusRef,
                this.responseMessageBusRef,
                store,
            ),
        };

        return this;
    }

    public registerCommand<T>(
        topic: string,
        name: string,
        command: StoreCommand<T>,
    ): SequencerServer {
        const { store } = this.services[topic];
        if (!store) {
            return this;
        }

        store.registerCommand(name, command);

        return this;
    }

    public static createServer(
        requestMessageBusRef: MessageBus,
        responseMessageBusRef: MessageBus,
    ): SequencerServer {
        if (LocalSequencerServer.instance) {
            return LocalSequencerServer.instance;
        }

        LocalSequencerServer.instance = new LocalSequencerServer(
            requestMessageBusRef,
            responseMessageBusRef,
        );

        return LocalSequencerServer.instance;
    }
}
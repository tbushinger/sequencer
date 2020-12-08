import { MessageBus } from "sequencer-bus";
import { requestBus, responseBus } from "sequencer-bus-local";
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
    private requestBus: MessageBus;
    private responseBus: MessageBus;

    constructor() {
        this.serviceFactory = createLocalSequencerService();
        this.requestBus = requestBus;
        this.responseBus = responseBus;
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
                this.requestBus,
                this.responseBus,
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

    public static createServer(): SequencerServer {
        if (LocalSequencerServer.instance) {
            return LocalSequencerServer.instance;
        }

        LocalSequencerServer.instance = new LocalSequencerServer();

        return LocalSequencerServer.instance;
    }
}
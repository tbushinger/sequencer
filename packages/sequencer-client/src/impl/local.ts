import { MessageBus } from "sequencer-bus";
import { requestBus, responseBus } from "sequencer-bus-local";
import { createMessage, Message } from "sequencer-models";
import { SequencerClient, SequencerClientResponse, UnsubcribeSequencerClientResponseUnsub } from "../types";

export default class LocalSequencerClient implements SequencerClient {
    private static instance: LocalSequencerClient;
    private userId: string;
    private requestBus: MessageBus;
    private responseBus: MessageBus;

    constructor(userId: string) {
        this.requestBus = requestBus;
        this.responseBus = responseBus;
        this.userId = userId;
    }

    public request<T>(
        topic: string,
        commandName: string,
        payload: T,
    ): void {
        this.requestBus.emit(createMessage(
            this.userId,
            topic,
            commandName,
            payload,
        ));
    }

    public response<T>(
        topic: string,
        handler: SequencerClientResponse<T>,
    ):  UnsubcribeSequencerClientResponseUnsub {
        return this.responseBus.on((message: Message) => {
            if (message.topic === topic) {
                handler(message.data);
            } 
        });
    }

    public static createClient(userId: string = "defaultUser"): SequencerClient {
        if (LocalSequencerClient.instance) {
            return LocalSequencerClient.instance;
        }

        LocalSequencerClient.instance = new LocalSequencerClient(userId);

        return LocalSequencerClient.instance;
    }
}
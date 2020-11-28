import { MessageBus } from "sequencer-bus";
import { Store } from "sequencer-store";

export type UnsubscribeService = () => void;

export interface SequencerService {
    register<T>(topic: string, requestBus: MessageBus, responseBus: MessageBus, store: Store<T>): UnsubscribeService;
    getTopics(): string[];
}
import { Message } from "sequencer-models";

export type BusUnsubscribe = () => void;

export type BusSubscription = (message: Message) => void;

export type BusErrorCallback = (error: Error, message: Message) => void;

export interface MessageBus {
    emit(message: Message): void;
    on(subscription: BusSubscription): BusUnsubscribe;
    onError(errorCallback: BusErrorCallback): void;
}
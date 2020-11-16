import { Message } from "sequencer-models";

export type Unsubscribe = () => void;

export type Subscription = (message: Message) => void;

export type ErrorCallback = (error: Error, message: Message) => void;

export interface MessageBus {
    emit(message: Message): void;
    on(topic: string, subscription: Subscription): Unsubscribe;
    onError(errorCallback: ErrorCallback): void;
}
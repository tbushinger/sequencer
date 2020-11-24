import { Message } from "sequencer-models";

export type StoreUnsubscribe = () => void;

export type StoreSubscription<T> = (model: T, message: Message) => void;

export type StoreErrorCallback<T> = (error: Error, model: T,  message: Message) => void;

export type StoreCommand<T> = (input: T, message: Message) => T;

export type StoreOnError<T> = (error: Error, model: T) => void;

export type StoreOnChange<T> = (output: T, message: Message) => void;

export type StoreCommands<T> = {
    [commandName: string]: StoreCommand<T>;
}

export interface Store<T> {
    registerCommand(commandName: string, command: StoreCommand<T>): void;
    apply(message: Message): void;
    onChange(subscription: StoreSubscription<T>): StoreUnsubscribe;
    onError(onStoreError: StoreOnError<T>): void;
    getModel(): T;
}
import { get, set } from "lodash";
import {
    Message,
    Messages,
    count,
    createId,
    dequeue,
    enqueue
} from "sequencer-models";
import {
    Store,
    StoreCommand,
    StoreCommands,
    StoreErrorCallback,
    StoreSubscription,
    StoreUnsubscribe
} from "../types";

type OnChangeHandler<T> = {
    id: string;
    subscription: StoreSubscription<T>;
}

type OnChangeHandlers<T> = OnChangeHandler<T>[];

export class LocalStore<T> implements Store<T> {
    private commands: StoreCommands<T>;
    private messages: Messages;
    private onChangeHandlers: OnChangeHandlers<T>;
    private errorCallback: StoreErrorCallback<T> = () => { };
    private model: T;

    constructor(initial: T) {
        this.commands = {};
        this.messages = [];
        this.onChangeHandlers = [];
        this.model = initial;
        this._handleMessages = this._handleMessages.bind(this);
    }

    private _handleMessage(
        message: Message,
    ): void {
        try {
            const command: StoreCommand<T> = get(this.commands, [message.command]);

            if (!command) {
                throw new Error(`Command ${message.command} not found!`)
            }

            this.model = command(this.model, message);

            this.onChangeHandlers.forEach(
                (sub: OnChangeHandler<T>) => sub.subscription(this.model, message));

        } catch (err) {
            this.errorCallback(err, this.model, message);
        }
    }

    private _handleMessages(): void {
        while (count(this.messages)) {
            const info = dequeue(this.messages);
            const message: Message = info.message as Message;
            this.messages = info.messages;

            this._handleMessage(message);
        }
    }

    public handleMessages(): void {
        setTimeout(this._handleMessages, 1);
    }

    public registerCommand(commandName: string, command: StoreCommand<T>): void {
        set(this.commands, [commandName], command);
    }

    public apply(message: any): void {
        this.messages = enqueue(this.messages, message);

        this.handleMessages();
    }

    public onChange(subscription: StoreSubscription<T>): StoreUnsubscribe {
        const id = createId();

        this.onChangeHandlers.push({
            id,
            subscription,
        });

        this.handleMessages();

        return () => {
            this.onChangeHandlers = this.onChangeHandlers.filter(
                (sub) => sub.id !== id);
        }
    }

    public getModel(): T {
        return this.model;
    }

    public onError(errorCallback: StoreErrorCallback<T>): void {
        this.errorCallback = errorCallback;
    }
}

export function createLocalStore<T>(initial: T): Store<T> {
    return new LocalStore<T>(initial);
}
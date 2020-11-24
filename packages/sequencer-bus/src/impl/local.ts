import {
    Message,
    Messages,
    count,
    createId,
    dequeue,
    enqueue
} from "sequencer-models";
import {
    BusErrorCallback,
    BusSubscription,
    BusUnsubscribe,
    MessageBus
} from "../types";

type BusMessageHandler = {
    id: string;
    subscription: BusSubscription;
}

type BusMessageHandlers = BusMessageHandler[];

export class LocalMessageBus implements MessageBus {
    private messages: Messages;
    private handlers: BusMessageHandlers;
    private errorCallback: BusErrorCallback = () => { };

    constructor() {
        this.messages = [];
        this.handlers = [];
        this._handleMessages = this._handleMessages.bind(this);
    }

    private _handleMessages(): void {
        while (count(this.messages) && this.handlers.length) {
            const info = dequeue(this.messages);
            const message: Message = info.message as Message;
            this.messages = info.messages;

            this.handlers.forEach((sub: any) => {
                try {
                    sub.subscription(message);
                } catch (err) {
                    this.errorCallback(err, message);
                }
            });
        }
    }

    public handleMessages(): void {
        setTimeout(this._handleMessages, 1);
    }

    public emit(message: Message): void {
        this.messages = enqueue(this.messages, message);

        this.handleMessages();
    }

    public on(subscription: BusSubscription): BusUnsubscribe {
        const id = createId();

        this.handlers.push({
            id,
            subscription,
        });

        this.handleMessages();

        return () => {
            this.handlers = this.handlers.filter((sub) => sub.id !== id);
        }
    }

    public onError(errorCallback: BusErrorCallback): void {
        this.errorCallback = errorCallback;
    }
}

export function createLocalMessageBus(): MessageBus {
    return new LocalMessageBus();
}
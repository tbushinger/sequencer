import {
    count,
    createId,
    dequeue,
    enqueue,
    Message,
    Messages
} from "sequencer-models";
import {
    ErrorCallback,
    MessageBus,
    Subscription,
    Unsubscribe
} from "../types";

type SubHandler = {
    id: string;
    subscription: Subscription;
}

type SubHandlers = SubHandler[];

type TopicHandlers = {
    [topic: string]: SubHandlers;
}

type TopicMessages = {
    [topic: string]: Messages;
}

export class LocalMessageBus implements MessageBus {
    private topicMessages: TopicMessages;
    private topicHandlers: TopicHandlers;
    private errorCallback: ErrorCallback = () => { };

    constructor() {
        this.topicMessages = {};
        this.topicHandlers = {};
        this._handleTopic = this._handleTopic.bind(this);
    }

    private _handleTopic(): void {
        Object.keys(this.topicHandlers).forEach((topic: string) => {
            const subHandlers: SubHandlers = this.topicHandlers[topic] || [];
            this._handleSubscriptions(subHandlers, topic);
        })
    }

    private _handleSubscriptions(
        subHandlers: SubHandlers,
        topic: string,
    ): void {
        let topicMessages: Messages = this.topicMessages[topic] || [];

        while (count(topicMessages) && subHandlers.length) {
            const info = dequeue(topicMessages);
            const message: Message = info.message as Message;
            topicMessages = info.messages;

            subHandlers.forEach((sub: any) => {
                try {
                    sub.subscription(message);
                } catch (err) {
                    this.errorCallback(err, message);
                }
            });
        }

        this.topicMessages[topic] = topicMessages;
    }

    public process() {
        setTimeout(this._handleTopic, 1);
    }

    public emit(message: Message): void {
        this.topicMessages[message.topic] =
            enqueue(this.topicMessages[message.topic] || [], message);

        this.process();
    }

    public on(topic: string, subscription: Subscription): Unsubscribe {
        const id = createId();
        const handlers: SubHandlers = this.topicHandlers[topic] || [];

        handlers.push({
            id,
            subscription,
        });

        this.topicHandlers[topic] = handlers;

        this.process();

        return () => {
            const _handlers = this.topicHandlers[topic] || [];
            const _updatedHandlers = _handlers.filter((sub) => sub.id !== id);
            this.topicHandlers[topic] = _updatedHandlers;
        }
    }

    onError(errorCallback: ErrorCallback): void {
        this.errorCallback = errorCallback;
    }
}

let instance: LocalMessageBus;

export function createLocalMessageBus(): MessageBus {
    if (instance) {
        return instance;
    }

    instance = new LocalMessageBus();

    return instance;
}
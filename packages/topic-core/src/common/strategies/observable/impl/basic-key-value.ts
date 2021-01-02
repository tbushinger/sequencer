import {
    Event,
    ObservableStrategy,
    SubscriptionHandler,
    Unsubscribe,
} from '../../../';

type BasicKeyValueSubscription = {
    id: number;
    eventName: string;
    handler: SubscriptionHandler;
};

type BasicKeyValueEventData = {
    eventName: string;
    eventData: Event;
};

export class BasicKeyValueObservableStrategy implements ObservableStrategy {
    private queue: BasicKeyValueEventData[];
    private subscriptions: BasicKeyValueSubscription[];
    private processing: boolean;

    constructor() {
        this.queue = [];
        this.subscriptions = [];
        this.processQueue = this.processQueue.bind(this);
        this.triggerProcessQueue = this.triggerProcessQueue.bind(this);
        this.shouldProcessQueue = this.shouldProcessQueue.bind(this);
    }

    private shouldProcessQueue(): boolean {
        return this.queue.length ? true : false;
    }

    private processQueue(): void {
        if (this.processing) {
            return;
        }

        this.processing = true;

        while (this.shouldProcessQueue()) {
            const next: BasicKeyValueEventData | undefined = this.queue.pop();
            if (next) {
                this.subscriptions.forEach(sub => {
                    if (
                        sub.eventName === next.eventName ||
                        sub.eventName === '*'
                    ) {
                        sub.handler(next.eventData);
                    }
                });
            }
        }

        this.processing = false;
    }

    private triggerProcessQueue(): void {
        setTimeout(this.processQueue, 1);
    }

    public emit(key: string, eventData: Event): void {
        this.queue.unshift({
            eventData,
            eventName: key,
        });

        this.triggerProcessQueue();
    }

    public subscribe(key: string, handler: SubscriptionHandler): Unsubscribe {
        const id = new Date().getTime();
        const sub: BasicKeyValueSubscription = {
            id,
            handler,
            eventName: key,
        };

        this.subscriptions.push(sub);

        this.triggerProcessQueue();

        return (): void => {
            this.subscriptions = this.subscriptions.filter(s => s.id !== id);
        };
    }

    public dispose(): void {
        this.subscriptions = [];
        this.queue = [];
    }

    static create(): BasicKeyValueObservableStrategy {
        return new BasicKeyValueObservableStrategy();
    }
}

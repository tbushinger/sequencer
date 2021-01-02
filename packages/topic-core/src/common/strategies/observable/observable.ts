import {
    Disposable,
    Event,
    Observable,
    SubscriptionHandler,
    Unsubscribe,
} from '../../';

export interface ObservableStrategy extends Disposable, Observable {
    emit: (eventName: string, eventData: Event) => void;
    subscribe: (
        eventName: string,
        handler: SubscriptionHandler,
    ) => Unsubscribe;
}

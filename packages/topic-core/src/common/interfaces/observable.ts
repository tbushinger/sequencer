import { Event } from "../types";

export type SubscriptionHandler = (eventData: Event) => void;

export type Unsubscribe = () => void;

export interface Observable {
    subscribe: (eventName: string, handler: SubscriptionHandler) => Unsubscribe;
}
export type Message<T> = {
    id: string;
    ts: number;
    userId: string;
    topic: string;
    command: string;
    data: T;
}
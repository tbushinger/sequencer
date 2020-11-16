export type Message = {
    id: string;
    ts: number;
    userId: string;
    topic: string;
    command: string;
    data: any;
}

export type Messages = Message[];
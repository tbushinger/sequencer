import { createId, createTs } from "../ids";
import { Message } from "../types";

export function createMessage<T>(
    userId: string,
    topic: string,
    command: string,
    data: T,
): Message<T> {
    return {
        userId,
        topic,
        command,
        data,
        ts: createTs(),
        id: createId(),
    };
}
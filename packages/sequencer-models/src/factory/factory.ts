import { createId, createTs } from "../ids";
import { Message } from "../types";

export function createMessage(
    userId: string,
    topic: string,
    command: string,
    data: any,
): Message {
    return {
        userId,
        topic,
        command,
        data,
        ts: createTs(),
        id: createId(),
    };
}
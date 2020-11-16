import { Message, Messages } from "../types";

export function enqueue(
    messages: Messages,
    message: Message,
): Messages {
    return [message].concat(messages || []);
}

export function count(
    messages: Messages
): number {
    return (messages || []).length;
}

export function dequeue(
    messages: Messages,
): {
    messages: Messages;
    message?: Message;
} {
    if (count(messages) === 0) {
        return {
            messages: []
        }
    }

    const message: Message = messages.pop() as Message;

    return {
        message,
        messages
    };
}
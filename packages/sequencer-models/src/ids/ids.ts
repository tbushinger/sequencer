import * as uuid from "uuid";

export function createId(): string {
    return uuid.v4();
}

export function createTs(): number {
    return (new Date()).getTime();
}

export interface Serializeable {
    serialize: <T>() => T;
}
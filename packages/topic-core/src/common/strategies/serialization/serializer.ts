export interface SerializationStrategy {
    serialize: <T>(value: T) => any;
}
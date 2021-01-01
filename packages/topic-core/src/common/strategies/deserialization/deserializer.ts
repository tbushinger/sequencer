export interface DeserializationStrategy {
    deserialize: (payload: any, context: any) => any;
}
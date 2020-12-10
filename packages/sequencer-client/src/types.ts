
export type  UnsubcribeSequencerClientResponseUnsub = () => void;
export type SequencerClientResponse<T> = (payload: T) => void;

export interface SequencerClient {
    request<T>(topic: string, commandName: string, payload: T): void;
    response<T>(topic: string, handler: SequencerClientResponse<T>):  UnsubcribeSequencerClientResponseUnsub;
}
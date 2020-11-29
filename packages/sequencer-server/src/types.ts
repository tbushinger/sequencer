import { StoreCommand } from "sequencer-store";

export interface SequencerServer {
    registerCommand<T>(topic: string, name: string, command: StoreCommand<T>): SequencerServer;
    registerStore<T>(topic: string, initial: T): SequencerServer;
}
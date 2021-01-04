import { Command, Disposable } from '../../';

export interface ExecuteableStrategy extends Disposable {
    addCommand: (commandName: string, command: Command) => void;
    getCommand: (CommandName: string) => Command;
    execute: (commandName: string, input: any) => void;
}

import { Command, Disposable } from '../../';

export interface ExecuteableStrategy extends Disposable {
    addCommand: (commandName: string, command: Command) => ExecuteableStrategy;
    getCommand: (CommandName: string) => Command;
    execute: (commandName: string, input: any) => any;
}

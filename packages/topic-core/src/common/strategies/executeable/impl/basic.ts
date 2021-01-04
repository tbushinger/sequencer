import { Command } from '../../../';
import { ExecuteableStrategy } from '../executable';

export class BasicExecuteableStrategy implements ExecuteableStrategy {
    private commands: {
        [commandName: string]: Command;
    } = {};

    public addCommand(commandName: string, command: Command): void {
        this.commands[commandName] = command;
    }

    public getCommand(commandName: string): Command {
        return this.commands[commandName];
    }

    public execute(commandName: string, input: any): void {
        const command: Command | undefined = this.commands[commandName];

        if (command) {
            command(input);
        }
    }

    public dispose(): void {
        (this.commands as any) = undefined;
    }

    static create(): BasicExecuteableStrategy {
        return new BasicExecuteableStrategy();
    }
}

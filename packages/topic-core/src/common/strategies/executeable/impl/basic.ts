import { Command } from '../../../';
import { ExecuteableStrategy } from '../executable';

export class BasicExecuteableStrategy implements ExecuteableStrategy {
    private commands: {
        [commandName: string]: Command;
    } = {};

    public addCommand(commandName: string, command: Command): BasicExecuteableStrategy {
        this.commands[commandName] = command;

        return this;
    }

    public getCommand(commandName: string): Command {
        return this.commands[commandName];
    }

    public execute(commandName: string, input: any): any {
        const command: Command | undefined = this.commands[commandName];

        if (command) {
            return command(input);
        }

        return undefined;
    }

    public dispose(): void {
        (this.commands as any) = undefined;
    }

    static create(): BasicExecuteableStrategy {
        return new BasicExecuteableStrategy();
    }
}

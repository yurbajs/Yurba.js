import { CommandArgsSchema, CommandHandler, Message } from "../types";
export default class CommandManager {
  private commands;
  constructor();
  registerCommand(
    command: string,
    argsSchema: CommandArgsSchema,
    handler: CommandHandler,
  ): void;
  executeCommand(
    command: string,
    args: string[],
    message: Message["Message"],
  ): Promise<void>;
  private parseArgs;
}
//# sourceMappingURL=CommandManager.d.ts.map

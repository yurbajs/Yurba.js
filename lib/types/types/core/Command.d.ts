import { Message } from "./";
export type CommandArgsSchemaEntry = {
  type: "string" | "int";
  required?: boolean;
  default?: any;
  rest?: boolean;
};
export type CommandArgsSchema = Record<
  string,
  CommandArgsSchemaEntry | string | [string, any?, "rest"?]
>;
export type CommandHandler = (
  message: Message["Message"],
  args: CommandArgsSchema,
) => Promise<void>;
export type OptionType = "string" | "boolean" | "int" | "user" | "repost";
export interface CommandOption {
  name: string;
  type: OptionType;
  required: boolean;
  description: string;
  default?: any;
  rest?: boolean;
}
export interface CommandDefinition {
  name: string;
  description: string;
  options: CommandOption[];
  handler: (message: Message, args: any) => Promise<void>;
}
//# sourceMappingURL=Command.d.ts.map

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandManager {
  constructor() {
    this.commands = new Map();
  }
  registerCommand(command, argsSchema, handler) {
    if (this.commands.has(command)) {
      throw new Error(`Command "${command}" is already registered.`);
    }
    this.commands.set(command, { handler, argsSchema });
  }
  async executeCommand(command, args, message) {
    if (!this.commands.has(command)) {
      throw new Error(`Command "${command}" not found.`);
    }
    const { handler, argsSchema } = this.commands.get(command);
    const parsedArgs = await this.parseArgs(args, argsSchema, message);
    if (!parsedArgs) {
      throw new Error("Invalid arguments for the command.");
    }
    await handler(message, parsedArgs);
  }
  async parseArgs(args, argsSchema, message) {
    const parsedArgs = {};
    const schemaEntries = Object.entries(argsSchema);
    for (const [argName, argConfig] of schemaEntries) {
      let type,
        required = true,
        defaultValue,
        captureRest = false;
      if (typeof argConfig === "string") {
        type = argConfig;
        defaultValue = null;
      } else if (Array.isArray(argConfig)) {
        type = argConfig[0];
        if (argConfig.length >= 3 && argConfig[2] === "rest") {
          captureRest = true;
        }
        if (argConfig.length === 2) {
          required = argConfig[1] !== false;
          defaultValue = argConfig[1] === false ? null : argConfig[1];
        }
      } else {
        type = argConfig.type;
        required = argConfig.required ?? true;
        defaultValue = argConfig.default ?? null;
        captureRest = argConfig.rest === true;
      }
      let argValue;
      if (captureRest) {
        argValue = args.join(" ");
        args = [];
      } else {
        argValue = args.shift();
      }
      if (argValue === undefined) {
        if (required) {
          throw new Error(`Missing required argument: ${argName}`);
        } else {
          parsedArgs[argName] = defaultValue;
          continue;
        }
      }
      switch (type) {
        case "string":
          parsedArgs[argName] = argValue;
          break;
        case "int":
          const intValue = parseInt(argValue, 10);
          if (isNaN(intValue)) {
            throw new Error(`Argument "${argName}" must be a number.`);
          }
          parsedArgs[argName] = intValue;
          break;
        default:
          throw new Error(`Unknown argument type: ${type}`);
      }
    }
    return parsedArgs;
  }
}
exports.default = CommandManager;

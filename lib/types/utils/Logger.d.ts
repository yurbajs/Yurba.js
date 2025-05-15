/**
 * A simple terminal progress bar.
 * @example
 * const bar = new ProgressBar(100, "Uploading");
 * bar.update(50);
 * bar.increment();
 * bar.stop();
 */
export declare class ProgressBar {
    private total;
    private current;
    private description;
    private width;
    private color;
    private startTime;
    private isFinished;
    /**
     * Create a new ProgressBar.
     * @param total Total number of steps.
     * @param description Optional description.
     * @param width Bar width in characters.
     * @param color Bar color.
     */
    constructor(total: number, description?: string, width?: number, color?: string);
    /**
     * Update the progress bar to a specific value.
     * @param current Current progress value.
     */
    update(current: number): void;
    /**
     * Increment the progress bar by a step.
     * @param step Step size (default 1).
     */
    increment(step?: number): void;
    /**
     * Finish and stop the progress bar.
     */
    stop(): void;
    private getElapsedTime;
    private render;
}
/**
 * Logger utility for colored and leveled console output.
 * @example
 * const logger = new Logger("BOT");
 * logger.info("Bot started");
 * logger.error("Something went wrong");
 */
declare class Logger {
    /**
     * ANSI color codes for styling.
     */
    static col: {
        reset: string;
        red: string;
        yellow: string;
        blue: string;
        magenta: string;
        green: string;
        gray: string;
        cyan: string;
        white: string;
        brightRed: string;
        brightGreen: string;
        brightYellow: string;
        brightBlue: string;
        brightMagenta: string;
        brightCyan: string;
        brightWhite: string;
        bgRed: string;
        bgGreen: string;
        bgYellow: string;
        bgBlue: string;
        bgMagenta: string;
        bgCyan: string;
        bgWhite: string;
        bgBrightBlack: string;
        bgGray: string;
        bgBrightRed: string;
        bgBrightGreen: string;
        bgBrightYellow: string;
        bgBrightBlue: string;
        bgBrightMagenta: string;
        bgBrightCyan: string;
        bgBrightWhite: string;
        bold: string;
        underline: string;
        reverse: string;
        blink: string;
        hidden: string;
        strikethrough: string;
    };
    private prefix;
    /**
     * Create a new Logger.
     * @param prefix Prefix for all log messages.
     */
    constructor(prefix?: string);
    private formatTime;
    private log;
    /**
     * Log an error message.
     */
    error(...args: any[]): void;
    /**
     * Log a warning message.
     */
    warn(...args: any[]): void;
    /**
     * Log an info message.
     */
    info(...args: any[]): void;
    /**
     * Log a debug message.
     */
    debug(...args: any[]): void;
    /**
     * Log a success message.
     */
    success(...args: any[]): void;
    /**
     * Create a new progress bar.
     * @param total Total steps for the progress bar.
     * @param options Progress bar options.
     * @returns ProgressBar instance.
     */
    createProgressBar(total: number, options?: {
        description?: string;
        width?: number;
        color?: string;
    }): ProgressBar;
}
export default Logger;
//# sourceMappingURL=Logger.d.ts.map
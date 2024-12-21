import { ITerminalOptions, Terminal, ITheme } from '@xterm/xterm';
export { Terminal };

/**
 * Theme configuration for the terminal
 */
export interface TerminalTheme extends ITheme {
    /** The default foreground color */
    foreground: string;
    /** The default background color */
    background: string;
    /** The cursor color */
    cursor: string;
    /** The selection background color */
    selectionBackground: string;
    /** ANSI black */
    black: string;
    /** ANSI bright black */
    brightBlack: string;
    /** ANSI red */
    red: string;
    /** ANSI bright red */
    brightRed: string;
    /** ANSI green */
    green: string;
    /** ANSI bright green */
    brightGreen: string;
    /** ANSI yellow */
    yellow: string;
    /** ANSI bright yellow */
    brightYellow: string;
    /** ANSI blue */
    blue: string;
    /** ANSI bright blue */
    brightBlue: string;
    /** ANSI magenta */
    magenta: string;
    /** ANSI bright magenta */
    brightMagenta: string;
    /** ANSI cyan */
    cyan: string;
    /** ANSI bright cyan */
    brightCyan: string;
    /** ANSI white */
    white: string;
    /** ANSI bright white */
    brightWhite: string;
}

/**
 * Options for initializing the terminal.
 */
export interface InitOptions {
    /**
     * The welcome message displayed when the terminal starts.
     */
    welcomeMessage: string;

    /**
     * The list of commands available in the terminal.
     */
    commands: Command[];

    /**
     * Configuration options for the terminal.
     */
    terminalOptions: ITerminalOptions;

    /**
     * The theme of the terminal.
     */
    theme: TerminalTheme;

    /**
     * Whether to play a sound on certain actions.
     */
    playSound: boolean;

    /**
     * The title of the terminal window.
     */
    title: string;

    /**
     * The font family used in the terminal.
     */
    fontFamily: string;

    /**
     * The unique identifier for the terminal instance.
     */
    id: string;

    /**
     * The prompt string displayed in the terminal.
     */
    prompt: string;
}

export interface Command {
    command: string;
    description: string;
    action: (terminal: Terminal, args: string[]) => Promise<void>;
    subCommands?: Command[];
}

export type TerminalRef = Terminal | undefined;

export interface TerminalManagerReturn {
    terminal: Terminal;
    destroy: () => void;
}

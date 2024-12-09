import { ITerminalOptions, Terminal } from '@xterm/xterm';
declare module 'figlet/importable-fonts/standard';

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
    theme: string;

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

export interface TerminalManagerReturn {
    terminal: Terminal;
    destroy: () => void;
}

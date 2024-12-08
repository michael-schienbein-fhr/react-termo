import { ITerminalOptions, Terminal } from 'xterm';
declare module 'figlet/importable-fonts/standard';
export interface InitOptions {
    hotKey: string;
    welcomeMessage: string;
    commands: Command[];
    terminalOptions: ITerminalOptions;
    theme: string;
    playSound: boolean;
}

export interface Command {
    command: string;
    description: string;
    action: (terminal: Terminal, args: string[]) => Promise<void>;
    subCommands?: Command[];
}

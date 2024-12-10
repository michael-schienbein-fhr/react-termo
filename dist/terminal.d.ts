import { ITerminalOptions, Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { InitOptions, Command } from './interfaces';
declare class TerminalManager {
    terminalOptions: ITerminalOptions;
    terminal: Terminal;
    fitAddon: FitAddon;
    webLinksAddon: WebLinksAddon;
    userCommands: Command[];
    commandHistory: any;
    historyIndex: number;
    inputBuffer: string;
    opts: InitOptions;
    constructor(div: HTMLElement, optsReceived: InitOptions);
    destroy(): void;
    focus(): void;
    resize(): void;
}
export default TerminalManager;
//# sourceMappingURL=terminal.d.ts.map
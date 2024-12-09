import { ITerminalOptions, Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { InitOptions, Command } from './types';
import Sounds from './sounds';

class TerminalManager {
    terminalOptions: ITerminalOptions;
    terminal: Terminal;
    fitAddon: FitAddon;
    webLinksAddon: WebLinksAddon;
    userCommands: Command[];
    commandHistory: any;
    historyIndex: number;
    inputBuffer: string;
    opts: InitOptions;

    constructor(div: HTMLElement, optsReceived: InitOptions) {
        this.opts = { ...optsReceived };

        this.terminalOptions = this.opts.terminalOptions;
        this.terminal = new Terminal(this.terminalOptions);
        this.fitAddon = new FitAddon();
        this.webLinksAddon = new WebLinksAddon();
        this.terminal.open(div);
        this.terminal.loadAddon(this.fitAddon);
        this.terminal.loadAddon(this.webLinksAddon);
        this.fitAddon.fit();

        window.addEventListener('resize', this.handleResize);

        this.userCommands = this.opts.commands;

        //create help command
        this.userCommands.push({
            command: 'help',
            description: 'List all commands',
            action: async (terminal) => {
                terminal.write(`\r\nCommands:\r\n`);
                this.userCommands.forEach((cmd) => {
                    terminal.write(`  ${cmd.command} - ${cmd.description}\r\n`);
                });
            },
        });
        // Create clear command
        this.userCommands.push({
            command: 'clear',
            description: 'Clear the terminal screen',
            action: async (terminal) => {
                terminal.write('\x1b[2J'); // Clear screen
                terminal.write('\x1b[H'); // Move cursor to home position
            },
        });

        this.commandHistory = [];
        this.historyIndex = -1;
        this.inputBuffer = '';

        // Add color codes
        const GREEN = '\x1b[32m';
        const RESET = '\x1b[0m';
        const prompt = `${GREEN}${this.opts.prompt}${RESET} `;

        if (!!this.opts.welcomeMessage) {
            this.terminal.write('\x1b[3m');
            this.terminal.write(this.opts.welcomeMessage);
            this.terminal.write('\x1b[0m');
            this.terminal.write('\r\n');
        }

        this.terminal.write('-'.repeat(this.terminal.cols));
        this.terminal.write('\r\n');
        this.terminal.write("Type 'help' to list all available commands");
        this.terminal.write('\r\n');
        this.terminal.write('-'.repeat(this.terminal.cols));

        this.terminal.write(`\r\n${prompt}`);

        this.terminal.onData(async (data) => {
            const key = data.charCodeAt(0);

            // Handle Ctrl+C
            if (key === 3) {
                this.inputBuffer = '';
                this.historyIndex = -1;
                this.terminal.write('^C');
                this.terminal.write(`\r\n${prompt}`);
                return;
            }

            // Handle up arrow (27 91 65)
            if (data === '\x1b[A') {
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                    // Clear current line
                    this.terminal.write('\x1b[2K\r');
                    this.terminal.write(`${prompt}`);
                    // Show command from history
                    this.inputBuffer = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
                    this.terminal.write(this.inputBuffer);
                }
                return;
            }

            // Handle down arrow (27 91 66)
            if (data === '\x1b[B') {
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.terminal.write('\x1b[2K\r');
                    this.terminal.write(`${prompt}`);
                    this.inputBuffer = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
                    this.terminal.write(this.inputBuffer);
                } else if (this.historyIndex === 0) {
                    this.historyIndex = -1;
                    this.terminal.write('\x1b[2K\r');
                    this.terminal.write(`${prompt}`);
                    this.inputBuffer = '';
                }
                return;
            }

            // Handle Enter
            if (data === '\r') {
                if (this.inputBuffer.length > 0) {
                    this.commandHistory.push(this.inputBuffer);
                    this.historyIndex = -1;
                } else {
                    this.terminal.write(`\r\n${prompt}`);
                    return;
                }
                Sounds.runCommand(this.opts);
                if (this.inputBuffer.trim() === 'clear') {
                    // Clear screen and scroll buffer
                    this.terminal.write('\x1b[2J'); // Clear screen
                    this.terminal.write('\x1b[H'); // Move cursor to home position
                    this.terminal.write(`${prompt}`); // New prompt
                    this.inputBuffer = '';
                    return;
                }

                //find command
                let cmd = this.userCommands.find((c) => c.command === this.inputBuffer.split(' ')[0]);
                if (cmd) {
                    //has subcommands, then show the usage of the commands if no subcommand is provided
                    if (cmd.subCommands) {
                        if (this.inputBuffer.split(' ').length === 1) {
                            this.terminal.write(`\r\nUsage: ${cmd.command} <subcommand>`);
                            this.terminal.write(`\r\nSubcommands:\r\n`);
                            cmd.subCommands.forEach((subCmd: Command) => {
                                this.terminal.write(`  ${subCmd.command} - ${subCmd.description}\r\n`);
                            });
                        } else {
                            let subCmd = cmd.subCommands.find((c) => c.command === this.inputBuffer.split(' ')[1]);
                            if (subCmd) {
                                subCmd.action(this.terminal, this.inputBuffer.split(' ').slice(2));
                            } else {
                                this.terminal.write(
                                    `\r\nSubcommand not found: ${this.inputBuffer.split(' ')[1]}. Type 'help' to list all available commands`,
                                );
                            }
                        }
                    } else {
                        await cmd.action(this.terminal, this.inputBuffer.split(' ').slice(1));
                    }
                } else {
                    this.terminal.write(
                        `\r\nCommand not found: ${this.inputBuffer}. Type 'help' to list all available commands`,
                    );
                }

                this.inputBuffer = '';
                this.terminal.write(`\r\n${prompt}`);

                return;
            }

            // Handle backspace
            if (data === '\x7f') {
                if (this.inputBuffer.length > 0) {
                    this.inputBuffer = this.inputBuffer.slice(0, -1);
                    this.terminal.write('\b \b');
                }
                return;
            }

            // Add character to buffer and echo
            this.inputBuffer += data;
            this.terminal.write(data);
        });
    }

    handleResize = () => {
        this.fitAddon.fit();
    };

    destroy() {
        window.removeEventListener('resize', this.handleResize);

        // Dispose addons
        this.fitAddon.dispose();
        this.webLinksAddon.dispose();

        // Dispose terminal
        this.terminal.dispose();

        // // Clear any references
        this.userCommands = [];
        this.inputBuffer = '';
        this.commandHistory = [];
    }

    focus() {
        this.terminal.focus();
    }
}

export default TerminalManager;

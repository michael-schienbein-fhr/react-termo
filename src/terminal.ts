import { ITerminalOptions, Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { InitOptions, Command } from './types';
import Sounds from './sounds';

const TerminalManager = (div: HTMLElement, opts: InitOptions) => {
    let terminalOptions = opts.terminalOptions;

    const terminal = new Terminal(terminalOptions);
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    terminal.open(div);
    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webLinksAddon);
    fitAddon.fit();

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);
    let userCommands = opts.commands;

    //create help command
    userCommands.push({
        command: 'help',
        description: 'List all commands',
        action: async (terminal) => {
            terminal.write(`\r\nCommands:\r\n`);
            userCommands.forEach((cmd) => {
                terminal.write(`  ${cmd.command} - ${cmd.description}\r\n`);
            });
        },
    });

    // Add command history
    let commandHistory: string[] = [];
    let historyIndex = -1;
    let inputBuffer = '';

    // Add color codes
    const GREEN = '\x1b[32m';
    const RESET = '\x1b[0m';
    const prompt = `${GREEN}$${RESET} `;

    if (!!opts.welcomeMessage) {
        terminal.write('\x1b[3m');
        terminal.write(opts.welcomeMessage);
        terminal.write('\x1b[0m');
        terminal.write('\r\n');
    }

    terminal.write('-'.repeat(terminal.cols));
    terminal.write('\r\n');
    terminal.write("Type 'help' to list all available commands");
    terminal.write('\r\n');
    terminal.write('-'.repeat(terminal.cols));

    terminal.write(`\r\n${prompt}`);

    terminal.onData(async (data) => {
        const key = data.charCodeAt(0);

        // Handle Ctrl+C
        if (key === 3) {
            inputBuffer = '';
            historyIndex = -1;
            terminal.write('^C');
            terminal.write(`\r\n${prompt}`);
            return;
        }

        // Handle up arrow (27 91 65)
        if (data === '\x1b[A') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                // Clear current line
                terminal.write('\x1b[2K\r');
                terminal.write(`${prompt}`);
                // Show command from history
                inputBuffer = commandHistory[commandHistory.length - 1 - historyIndex];
                terminal.write(inputBuffer);
            }
            return;
        }

        // Handle down arrow (27 91 66)
        if (data === '\x1b[B') {
            if (historyIndex > 0) {
                historyIndex--;
                terminal.write('\x1b[2K\r');
                terminal.write(`${prompt}`);
                inputBuffer = commandHistory[commandHistory.length - 1 - historyIndex];
                terminal.write(inputBuffer);
            } else if (historyIndex === 0) {
                historyIndex = -1;
                terminal.write('\x1b[2K\r');
                terminal.write(`${prompt}`);
                inputBuffer = '';
            }
            return;
        }

        // Handle Enter
        if (data === '\r') {
            if (inputBuffer.length > 0) {
                commandHistory.push(inputBuffer);
                historyIndex = -1;
            } else {
                terminal.write(`\r\n${prompt}`);
                return;
            }
            Sounds.runCommand(opts);
            if (inputBuffer.trim() === 'clear') {
                // Clear screen and scroll buffer
                terminal.write('\x1b[2J'); // Clear screen
                terminal.write('\x1b[H'); // Move cursor to home position
                terminal.write(`${prompt}`); // New prompt
                inputBuffer = '';
                return;
            }

            //find command
            let cmd = userCommands.find((c) => c.command === inputBuffer.split(' ')[0]);
            if (cmd) {
                //has subcommands, then show the usage of the commands if no subcommand is provided
                if (cmd.subCommands) {
                    if (inputBuffer.split(' ').length === 1) {
                        terminal.write(`\r\nUsage: ${cmd.command} <subcommand>`);
                        terminal.write(`\r\nSubcommands:\r\n`);
                        cmd.subCommands.forEach((subCmd: Command) => {
                            terminal.write(`  ${subCmd.command} - ${subCmd.description}\r\n`);
                        });
                    } else {
                        let subCmd = cmd.subCommands.find((c) => c.command === inputBuffer.split(' ')[1]);
                        if (subCmd) {
                            subCmd.action(terminal, inputBuffer.split(' ').slice(2));
                        } else {
                            terminal.write(`\r\nSubcommand not found: ${inputBuffer.split(' ')[1]}`);
                        }
                    }
                } else {
                    await cmd.action(terminal, inputBuffer.split(' ').slice(1));
                }
            } else {
                terminal.write(`\r\nCommand not found: ${inputBuffer}`);
            }

            inputBuffer = '';
            terminal.write(`\r\n${prompt}`);

            return;
        }

        // Handle backspace
        if (data === '\x7f') {
            if (inputBuffer.length > 0) {
                inputBuffer = inputBuffer.slice(0, -1);
                terminal.write('\b \b');
            }
            return;
        }

        // Add character to buffer and echo
        inputBuffer += data;
        terminal.write(data);
    });

    return terminal;
};

export default TerminalManager;

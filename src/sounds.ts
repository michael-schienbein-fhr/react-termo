import { InitOptions } from './types';
const soundTerminalOpen = new Audio('https://stripe.dev/audio/terminal_open.mp3');
soundTerminalOpen.preload = 'auto';

const soundTerminalClose = new Audio('https://stripe.dev/audio/terminal_close.mp3');
soundTerminalClose.preload = 'auto';

const soundRunCommand = new Audio('https://stripe.dev/audio/run_command.mp3');
soundRunCommand.preload = 'auto';

export default {
    terminalOpen: function (opts: InitOptions) {
        let { playSound } = opts;
        if (!playSound) {
            return;
        }
        soundTerminalOpen.play().catch((error) => console.error('Error playing audio:', error));
    },
    terminalClose: function (opts: InitOptions) {
        let { playSound } = opts;
        if (!playSound) {
            return;
        }
        soundTerminalClose.play().catch((error) => console.error('Error playing audio:', error));
    },
    runCommand: function (opts: InitOptions) {
        let { playSound } = opts;
        if (!playSound) {
            return;
        }
        soundRunCommand.play().catch((error) => console.error('Error playing audio:', error));
    },
};

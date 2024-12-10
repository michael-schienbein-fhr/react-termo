import { InitOptions } from './interfaces';
let soundTerminalOpen: HTMLAudioElement | undefined,
    soundTerminalClose: HTMLAudioElement | undefined,
    soundRunCommand: HTMLAudioElement | undefined;

soundTerminalOpen = undefined;
soundTerminalClose = undefined;
soundRunCommand = undefined;

export default {
    terminalOpen: function (opts: InitOptions) {
        let { playSound } = opts;
        if (!playSound) {
            return;
        }

        if (soundTerminalOpen === undefined) {
            soundTerminalOpen = new Audio(
                'https://raw.githubusercontent.com/rajnandan1/termo/main/sounds/terminal_open.mp3',
            );
            soundTerminalOpen.preload = 'auto';
        }
        soundTerminalOpen.play().catch((error) => console.error('Error playing audio:', error));
    },
    terminalClose: function (opts: InitOptions) {
        let { playSound } = opts;
        if (!playSound) {
            return;
        }

        if (soundTerminalClose === undefined) {
            soundTerminalClose = new Audio(
                'https://raw.githubusercontent.com/rajnandan1/termo/main/sounds/terminal_close.mp3',
            );
            soundTerminalClose.preload = 'auto';
        }

        soundTerminalClose.play().catch((error) => console.error('Error playing audio:', error));
    },
    runCommand: function (opts: InitOptions) {
        let { playSound } = opts;
        if (!playSound) {
            return;
        }
        if (soundRunCommand === undefined) {
            soundRunCommand = new Audio(
                'https://raw.githubusercontent.com/rajnandan1/termo/main/sounds/run_command.mp3',
            );
            soundRunCommand.preload = 'auto';
        }

        soundRunCommand.play().catch((error) => console.error('Error playing audio:', error));
    },
};

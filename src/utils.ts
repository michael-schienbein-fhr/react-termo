import { InitOptions } from './types';
const Utils = {
    // Function to generate random string for id
    generateId(prefix: string): string {
        return prefix + '-' + Math.random().toString(36).substring(2);
    },
    containerDraggable(container: HTMLElement, header: HTMLElement) {
        let isDown = false;
        let startX: number;
        let startY: number;
        let offsetX: number;
        let offsetY: number;

        header.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.clientX;
            startY = e.clientY;
            offsetX = container.offsetLeft;
            offsetY = container.offsetTop;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        const onMouseMove = (e: MouseEvent) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.clientX - startX;
            const y = e.clientY - startY;
            container.style.left = offsetX + x + 'px';
            container.style.top = offsetY + y + 'px';
            // Calculate position from right and bottom edges
            container.style.right = `${window.innerWidth - (offsetX + x)}px`;
            container.style.bottom = `${window.innerHeight - (offsetY + y)}px`;
        };

        const onMouseUp = () => {
            isDown = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    },
    //given an element, return top,left given it should be at bottom:12, right:12
    getBottomRightPosition(element: HTMLElement): { top: number; left: number } {
        const rect = element.getBoundingClientRect();
        return {
            top: window.innerHeight - 490 - 12,
            left: window.innerWidth - 705 - 12,
        };
    },
    playAudio(filePath: string) {
        const audio = new Audio(filePath);
        audio.play();
    },
    getInitOptions(opts: InitOptions): InitOptions {
        const defaultOptions: InitOptions = {
            playSound: true,
            hotKey: 'Control+Space',
            welcomeMessage: 'Welcome to termo!',
            theme: 'light',
            commands: [
                {
                    command: 'joke',
                    description: 'Hear a random joke from a random API',
                    action: (terminal, args) => {
                        terminal.write('\r\n' + 'Thinking of a joke...');
                        return new Promise(async (resolve, reject) => {
                            try {
                                const response = await fetch('https://official-joke-api.appspot.com/random_joke');
                                const data = await response.json();
                                terminal.write('\r\n' + data.setup);
                                setTimeout(() => {
                                    resolve(terminal.write('\r\n' + data.punchline));
                                }, 2000);
                            } catch (error) {
                                terminal.write('\r\nFailed to fetch joke');
                            }
                        });
                    },
                },
            ],
            terminalOptions: {
                cursorBlink: true,
                fontSize: 14,
                theme: {
                    background: '#1e1e1e', // Dark background
                    foreground: '#fefefe', // White text
                    cursor: '#ffffff', // White cursor
                },
                fontFamily: 'Courier New, monospace',
                fontWeight: 'normal',
                lineHeight: 1.2,
                allowTransparency: true,
            },
        };
        const mergedOptions = { ...defaultOptions, ...opts };
        return mergedOptions;
    },
};

export default Utils;

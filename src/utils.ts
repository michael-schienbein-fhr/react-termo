import { InitOptions } from './interfaces';
import { themes } from './themes';
import * as packageInfo from '../package.json';

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
            if (!isDown || container.getAttribute('mode') == 'docked') return;
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
    getBottomRightPosition(): { top: number; left: number } {
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
        return {
            title: opts.title,
            id: opts.id,
            prompt: opts.prompt || '$',
            commands: [
                {
                    command: 'theme',
                    description: 'List or set terminal theme',
                    action: async (terminal) => {
                        terminal.write('\r\nUsage:\r\n');
                        terminal.write('  theme list - List available themes\r\n');
                        terminal.write('  theme set <theme-name> - Set terminal theme\r\n');
                    },
                    subCommands: [
                        {
                            command: 'list',
                            description: 'List available themes',
                            action: async (terminal) => {
                                terminal.write('\r\nAvailable themes:\r\n');
                                Object.keys(themes).forEach((themeName) => {
                                    terminal.write(`  ${themeName}\r\n`);
                                });
                            }
                        },
                        {
                            command: 'set',
                            description: 'Set terminal theme',
                            action: async (terminal, args) => {
                                if (!args || args.length === 0) {
                                    terminal.write('\r\nUsage: theme set <theme-name>');
                                    terminal.write('\r\nUse "theme list" to see available themes');
                                    return;
                                }
                                const themeName = args[0];
                                const theme = themes[themeName];
                                if (!theme) {
                                    terminal.write(`\r\nTheme "${themeName}" not found`);
                                    terminal.write('\r\nUse "theme list" to see available themes');
                                    return;
                                }
                                terminal.options.theme = theme;
                                // Force a terminal refresh to apply the theme
                                terminal.clearTextureAtlas();
                                terminal.refresh(0, terminal.rows - 1);
                                terminal.write(`\r\nTheme set to "${themeName}"\r\n`);
                            }
                        }
                    ]
                },
                ...(opts.commands || [])
            ],
            welcomeMessage: opts.welcomeMessage || `Welcome to Termo v${packageInfo.version}`,
            fontFamily: opts.fontFamily || 'monospace',
            playSound: opts.playSound ?? true,
            theme: opts.theme || themes.dark,
            terminalOptions: {
                cursorBlink: true,
                fontSize: 14,
                fontFamily: opts.fontFamily || 'monospace',
                theme: opts.theme || themes.dark,
                ...opts.terminalOptions
            }
        };
    },

    titleID(title: string): string {
        //md5 hash the title
        return btoa(title).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    },

    /**
     * Determines if a color is dark by calculating its relative luminance
     * @param color - Hex color string (e.g., '#000000')
     * @returns boolean - true if the color is dark, false if light
     */
    isColorDark(color: string): boolean {
        // Remove the hash if it exists
        const hex = color.replace('#', '');
        
        // Convert hex to RGB
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Calculate relative luminance using the sRGB color space
        // See: https://www.w3.org/TR/WCAG20/#relativeluminancedef
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return true if the color is dark (luminance < 0.5)
        return luminance < 0.5;
    }
};

export default Utils;

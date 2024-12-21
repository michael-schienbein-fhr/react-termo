import React, { useRef, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ReactTermo, { ReactTermoRef } from '../src/ReactTermo';
import { TerminalTheme } from '../src/interfaces';
import '@xterm/xterm/css/xterm.css';
import '../styles.css';

const App = () => {
  console.log('[TestPage] App component rendering');
  const termoRef = useRef<ReactTermoRef>(null);

  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('dark');

  const themes: Record<string, TerminalTheme> = {
    dark: {
      foreground: '#ffffff',
      background: '#000000',
      cursor: '#ffffff',
      selectionBackground: '#4d4d4d',
      black: '#000000',
      brightBlack: '#666666',
      red: '#cc0000',
      brightRed: '#ff0000',
      green: '#00cc00',
      brightGreen: '#00ff00',
      yellow: '#cccc00',
      brightYellow: '#ffff00',
      blue: '#0000cc',
      brightBlue: '#0000ff',
      magenta: '#cc00cc',
      brightMagenta: '#ff00ff',
      cyan: '#00cccc',
      brightCyan: '#00ffff',
      white: '#cccccc',
      brightWhite: '#ffffff'
    },
    light: {
      foreground: '#000000',
      background: '#ffffff',
      cursor: '#000000',
      selectionBackground: '#b3d7ff',
      black: '#000000',
      brightBlack: '#666666',
      red: '#cc0000',
      brightRed: '#ff0000',
      green: '#00cc00',
      brightGreen: '#00ff00',
      yellow: '#cccc00',
      brightYellow: '#ffff00',
      blue: '#0000cc',
      brightBlue: '#0000ff',
      magenta: '#cc00cc',
      brightMagenta: '#ff00ff',
      cyan: '#00cccc',
      brightCyan: '#00ffff',
      white: '#cccccc',
      brightWhite: '#ffffff'
    },
    synthwave: {
      background: '#2b213a',
      foreground: '#ff7edb',
      cursor: '#ff7edb',
      selectionBackground: '#ffffff44',
      black: '#2b213a',
      brightBlack: '#5c5c5c',
      red: '#fe4450',
      brightRed: '#fe4450',
      green: '#72f1b8',
      brightGreen: '#72f1b8',
      yellow: '#f97e72',
      brightYellow: '#fede5d',
      blue: '#03edf9',
      brightBlue: '#03edf9',
      magenta: '#ff7edb',
      brightMagenta: '#ff7edb',
      cyan: '#03edf9',
      brightCyan: '#03edf9',
      white: '#ffffff',
      brightWhite: '#ffffff'
    },
    dracula: {
      background: '#282a36',
      foreground: '#f8f8f2',
      cursor: '#f8f8f2',
      selectionBackground: '#44475a',
      black: '#21222c',
      brightBlack: '#6272a4',
      red: '#ff5555',
      brightRed: '#ff6e6e',
      green: '#50fa7b',
      brightGreen: '#69ff94',
      yellow: '#f1fa8c',
      brightYellow: '#ffffa5',
      blue: '#bd93f9',
      brightBlue: '#d6acff',
      magenta: '#ff79c6',
      brightMagenta: '#ff92df',
      cyan: '#8be9fd',
      brightCyan: '#a4ffff',
      white: '#f8f8f2',
      brightWhite: '#ffffff'
    },
    github: {
      background: '#ffffff',
      foreground: '#24292e',
      cursor: '#24292e',
      selectionBackground: '#0366d625',
      black: '#24292e',
      brightBlack: '#959da5',
      red: '#d73a49',
      brightRed: '#cb2431',
      green: '#28a745',
      brightGreen: '#22863a',
      yellow: '#dbab09',
      brightYellow: '#b08800',
      blue: '#0366d6',
      brightBlue: '#005cc5',
      magenta: '#5a32a3',
      brightMagenta: '#5a32a3',
      cyan: '#0598bc',
      brightCyan: '#3192aa',
      white: '#6a737d',
      brightWhite: '#959da5'
    },
    monokai: {
      background: '#272822',
      foreground: '#f8f8f2',
      cursor: '#f8f8f2',
      selectionBackground: '#49483e',
      black: '#272822',
      brightBlack: '#75715e',
      red: '#f92672',
      brightRed: '#f92672',
      green: '#a6e22e',
      brightGreen: '#a6e22e',
      yellow: '#f4bf75',
      brightYellow: '#f4bf75',
      blue: '#66d9ef',
      brightBlue: '#66d9ef',
      magenta: '#ae81ff',
      brightMagenta: '#ae81ff',
      cyan: '#a1efe4',
      brightCyan: '#a1efe4',
      white: '#f8f8f2',
      brightWhite: '#f9f8f5'
    }
  };

  useEffect(() => {
    console.log('[TestPage] App component mounted');
  }, []);

  const handleReady = (terminal: any) => {
    console.log('[TestPage] Terminal ready callback triggered');
    terminal.options.theme = themes[currentTheme];
  };

  useEffect(() => {
    if (termoRef.current?.terminal) {
      termoRef.current.terminal.options.theme = themes[currentTheme];
      termoRef.current.terminal.refresh(0, termoRef.current.terminal.rows - 1);
    }
  }, [currentTheme]);

  return (
    <div style={{ 
      padding: '20px', 
      height: '100vh', 
      background: themes[currentTheme].background, 
      color: themes[currentTheme].foreground,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      margin: 0,
      boxSizing: 'border-box'
    }}>
      <h1 style={{ margin: 0, fontSize: '24px' }}>React Termo Test Page</h1>
      <div style={{ 
        flex: 1,
        minHeight: '500px',
        border: `1px solid ${themes[currentTheme].brightBlack}`, 
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%'
      }}>
        <ReactTermo
          ref={termoRef}
          onReady={handleReady}
          theme={themes[currentTheme]}
          className="terminal-container"
          terminalOptions={{
            fontFamily: 'monospace',
            fontSize: 14,
            cursorBlink: true
          }}
          commands={[
            {
              command: 'hello',
              description: 'Display a friendly greeting',
              action: async (terminal) => {
                const greetings = [
                  "Hello there! 👋",
                  "G'day mate! 🦘",
                  "Howdy partner! 🤠",
                  "Greetings earthling! 👽",
                  "Hey you! 😊"
                ];
                const greeting = greetings[Math.floor(Math.random() * greetings.length)];
                terminal.write(`${greeting}\r\n`);
              },
            },
            {
              command: 'theme',
              description: 'Change the terminal theme',
              action: async (terminal, args) => {
                if (args.length === 0) {
                  terminal.write('Usage: theme <subcommand>\r\n');
                  terminal.write('Subcommands:\r\n');
                  terminal.write('  list - List available themes\r\n');
                  terminal.write('  <theme> - Set the terminal theme (e.g., theme dark, theme synthwave)\r\n');
                  return;
                }

                const subcommand = args[0];
                if (subcommand === 'list') {
                  terminal.write('Available themes:\r\n');
                  Object.keys(themes).forEach(theme => {
                    terminal.write(`  - ${theme}\r\n`);
                  });
                } else if (themes[subcommand]) {
                  setCurrentTheme(subcommand);
                  terminal.options.theme = themes[subcommand];
                  terminal.clearSelection();
                  terminal.refresh(0, terminal.rows - 1);
                  terminal.write(`Theme changed to ${subcommand}\r\n`);
                } else {
                  terminal.write(`Theme '${subcommand}' not found. Use 'theme list' to see available themes.\r\n`);
                }
              }
            },
            {
              command: 'banner',
              description: 'Display a cool ASCII art banner',
              action: async (terminal) => {
                terminal.write('\r\n');
                terminal.write('██████╗ ███████╗ █████╗  ██████╗████████╗\r\n');
                terminal.write('██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝\r\n');
                terminal.write('██████╔╝█████╗  ███████║██║        ██║   \r\n');
                terminal.write('██╔══██╗██╔══╝  ██╔══██║██║        ██║   \r\n');
                terminal.write('██║  ██║███████╗██║  ██║╚██████╗   ██║   \r\n');
                terminal.write('╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝   \r\n');
                terminal.write('\r\n');
                terminal.write('████████╗███████╗██████╗ ███╗   ███╗ ██████╗ \r\n');
                terminal.write('╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██╔═══██╗\r\n');
                terminal.write('   ██║   █████╗  ██████╔╝██╔████╔██║██║   ██║\r\n');
                terminal.write('   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║   ██║\r\n');
                terminal.write('   ██║   ███████╗██║  ██║██║ ╚═╝ ██║╚██████╔╝\r\n');
                terminal.write('   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝ \r\n');
                terminal.write('\r\n');
              }
            },
            {
              command: 'fortune',
              description: 'Get a random programming fortune',
              action: async (terminal) => {
                const fortunes = [
                  "There are 10 types of people in the world: those who understand binary, and those who don't.",
                  "Why do programmers prefer dark mode? Because light attracts bugs!",
                  "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
                  "The best thing about a boolean is even if you are wrong, you are only off by a bit.",
                  "Why did the programmer quit his job? Because he didn't get arrays."
                ];
                const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
                terminal.write(`${fortune}\r\n`);
              }
            },
            {
              command: 'date',
              description: 'Display current date and time',
              action: async (terminal) => {
                const now = new Date();
                terminal.write(`${now.toLocaleString()}\r\n`);
              }
            },
            {
              command: 'help',
              description: 'Show available commands',
              action: async (terminal) => {
                terminal.write('Available commands:\r\n');
                terminal.write('  hello  - Display a friendly greeting\r\n');
                terminal.write('  theme  - Change the terminal theme (try: theme list, theme <name>)\r\n');
                terminal.write('  banner - Display a cool ASCII art banner\r\n');
                terminal.write('  fortune - Get a random programming fortune\r\n');
                terminal.write('  date   - Display current date and time\r\n');
                terminal.write('  help   - Show this help message\r\n');
              },
            },
          ]}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

import React, { useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import ReactTermo, { ReactTermoRef } from '../src/ReactTermo';
import '@xterm/xterm/css/xterm.css';
import '../styles.css';

const App = () => {
  console.log('[TestPage] App component rendering');
  const termoRef = useRef<ReactTermoRef>(null);

  useEffect(() => {
    console.log('[TestPage] App component mounted');
  }, []);

  const handleReady = (terminal: any) => {
    console.log('[TestPage] Terminal ready callback triggered');
    // You can interact with the terminal here
    terminal.terminal.writeln('Terminal initialized successfully!');
  };

  return (
    <div style={{ 
      padding: '20px', 
      height: '100vh', 
      background: '#1e1e1e', 
      color: 'white',
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
        border: '1px solid #333', 
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        <ReactTermo
          ref={termoRef}
          welcomeMessage="Welcome to the test page! Type 'help' to see available commands."
          onReady={handleReady}
          theme="dark"
          terminalOptions={{
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            theme: {
              background: '#1e1e1e',
              foreground: '#ffffff',
              cursor: '#ffffff',
              selectionBackground: '#5b5b5b',
              black: '#1e1e1e',
              brightBlack: '#666666',
              red: '#e06c75',
              brightRed: '#e06c75',
              green: '#98c379',
              brightGreen: '#98c379',
              yellow: '#d19a66',
              brightYellow: '#d19a66',
              blue: '#61afef',
              brightBlue: '#61afef',
              magenta: '#c678dd',
              brightMagenta: '#c678dd',
              cyan: '#56b6c2',
              brightCyan: '#56b6c2',
              white: '#d4d4d4',
              brightWhite: '#ffffff'
            }
          }}
          commands={[
            {
              command: 'hello',
              description: 'Say hello',
              action: async (terminal) => {
                terminal.write('Hello from React Termo!\r\n');
              },
            },
            {
              command: 'help',
              description: 'Show available commands',
              action: async (terminal) => {
                terminal.write('Available commands:\r\n');
                terminal.write('  hello - Say hello\r\n');
                terminal.write('  help  - Show this help message\r\n');
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

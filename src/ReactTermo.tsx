import React, { useEffect, useRef, useImperativeHandle, forwardRef, Ref, useState } from 'react';
import { InitOptions, TerminalManagerReturn, TerminalRef, Command } from './interfaces';
import Termo from './index';

export interface ReactTermoProps extends Partial<InitOptions> {
  theme?: 'light' | 'dark';
  title?: string;
  fontFamily?: string;
  playSound?: boolean;
  commands?: Command[];
  welcomeMessage?: string;
  prompt?: string;
  className?: string;
  onReady?: (terminal: Termo) => void;
}

export interface ReactTermoRef {
  terminal: TerminalRef;
  setTheme: (theme: 'light' | 'dark') => void;
  create: () => void;
  show: () => void;
  hide: () => void;
  destroy: () => void;
  dock: () => void;
  float: () => void;
}

const ReactTermo = forwardRef<ReactTermoRef, ReactTermoProps>(({
  playSound = true,
  title = 'termo',
  welcomeMessage = 'Welcome to react-termo!',
  theme = 'dark',
  fontFamily = 'monospace',
  prompt = '$ ',
  commands = [],
  terminalOptions = {},
  className = '',
  onReady
}, ref: Ref<ReactTermoRef>) => {
  console.log('[ReactTermo] Component rendered with props:', {
    playSound,
    title,
    theme,
    fontFamily,
    commands: commands.length,
    className
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const terminalRef = useRef<Termo | null>(null);

  const setTheme = (newTheme: 'light' | 'dark') => {
    console.log('[ReactTermo] Setting theme:', newTheme);
    if (terminalRef.current && isInitialized) {
      terminalRef.current.setTheme(newTheme);
    } else {
      console.warn('[ReactTermo] Cannot set theme - terminal not initialized');
    }
  };

  useImperativeHandle(ref, () => ({
    terminal: terminalRef.current?.terminal,
    setTheme,
    create: () => {
      console.log('[ReactTermo] Create called');
      if (terminalRef.current && !isInitialized) {
        terminalRef.current.create();
        setIsInitialized(true);
        console.log('[ReactTermo] Terminal created and initialized');
      } else {
        console.warn('[ReactTermo] Create called but terminal already initialized or ref not available');
      }
    },
    show: () => {
      console.log('[ReactTermo] Show called');
      if (terminalRef.current && isInitialized) {
        terminalRef.current.show();
      } else {
        console.warn('[ReactTermo] Cannot show terminal - not initialized');
      }
    },
    hide: () => {
      console.log('[ReactTermo] Hide called');
      if (terminalRef.current && isInitialized) {
        terminalRef.current.hide();
      } else {
        console.warn('[ReactTermo] Cannot hide terminal - not initialized');
      }
    },
    destroy: () => {
      console.log('[ReactTermo] Destroy called');
      if (terminalRef.current && isInitialized) {
        terminalRef.current.destroy();
        setIsInitialized(false);
        console.log('[ReactTermo] Terminal destroyed');
      } else {
        console.warn('[ReactTermo] Cannot destroy terminal - not initialized');
      }
    },
    dock: () => {
      console.log('[ReactTermo] Dock called');
      if (terminalRef.current && isInitialized) {
        terminalRef.current.dock();
      } else {
        console.warn('[ReactTermo] Cannot dock terminal - not initialized');
      }
    },
    float: () => {
      console.log('[ReactTermo] Float called');
      if (terminalRef.current && isInitialized) {
        terminalRef.current.float();
      } else {
        console.warn('[ReactTermo] Cannot float terminal - not initialized');
      }
    }
  }));

  // Handle terminal cleanup
  useEffect(() => {
    return () => {
      if (terminalRef.current) {
        try {
          // First move the container back to body if it exists
          if (terminalRef.current.container && terminalRef.current.container.parentElement) {
            document.body.appendChild(terminalRef.current.container);
          }
          terminalRef.current.destroy();
        } catch (error) {
          console.error('Failed to cleanup terminal:', error);
        }
        terminalRef.current = null;
        setIsInitialized(false);
      }
    };
  }, []);

  // Initialize terminal
  useEffect(() => {
    if (!containerRef.current || isInitialized || terminalRef.current) {
      return;
    }

    console.log('Initializing terminal...');
    
    try {
      const terminal = new Termo({
        title: title || 'Terminal',
        theme: theme as 'light' | 'dark',
        fontFamily: fontFamily || 'monospace',
        playSound: playSound ?? true,
        commands: commands || [],
        welcomeMessage: welcomeMessage || '',
        id: `termo-${Math.random().toString(36).substr(2, 9)}`,
        prompt: prompt || '$ ',
        terminalOptions: {
          cursorBlink: true,
          fontSize: 14,
          fontFamily: fontFamily || 'monospace',
          theme: {
            background: theme === 'dark' ? '#1e1e1e' : '#ffffff',
            foreground: theme === 'dark' ? '#ffffff' : '#000000',
            cursor: theme === 'dark' ? '#ffffff' : '#000000',
            selectionBackground: theme === 'dark' ? '#ffffff44' : '#00000044',
          }
        },
      });

      // Create terminal but override container behavior
      terminal.create();
      
      // Move terminal container from body to our container
      if (terminal.container && terminal.container.parentElement) {
        terminal.container.parentElement.removeChild(terminal.container);
        containerRef.current.appendChild(terminal.container);
        
        // Reset positioning since we're no longer in body
        terminal.container.style.position = 'absolute';
        terminal.container.style.inset = '0';
        terminal.container.style.margin = '0';
        terminal.container.style.transform = 'scale(1)';
        terminal.container.style.width = '100%';
        terminal.container.style.height = '100%';
        terminal.container.style.maxWidth = '100%';
        terminal.container.style.maxHeight = '100%';
        terminal.container.style.right = 'auto';
        terminal.container.style.bottom = 'auto';
      }

      // Initialize terminal
      setIsInitialized(true);
      terminalRef.current = terminal;
      
      if (onReady) {
        onReady(terminal);
      }

      // Set theme and ensure visibility
      terminal.setTheme(theme as 'light' | 'dark');
      terminal.show();
      
      // Force a resize after a short delay to ensure proper sizing
      setTimeout(() => {
        if (terminal.terminalManager?.fitAddon) {
          terminal.terminalManager.fitAddon.fit();
        }
      }, 100);
      
    } catch (error) {
      console.error('Failed to initialize terminal:', error);
      setIsInitialized(false);
      terminalRef.current = null;
    }
  }, [containerRef.current, isInitialized, theme, commands, onReady, title, fontFamily, playSound, welcomeMessage, prompt]);

  // Handle theme changes
  useEffect(() => {
    console.log('[ReactTermo] Theme changed to:', theme);
    if (terminalRef.current && isInitialized && theme) {
      setTheme(theme as 'light' | 'dark');
    }
  }, [theme, isInitialized]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ 
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: theme === 'dark' ? '#1e1e1e' : '#ffffff',
        display: 'flex',
        flexDirection: 'column'
      }}
    />
  );
});

ReactTermo.displayName = 'ReactTermo';

export default ReactTermo;

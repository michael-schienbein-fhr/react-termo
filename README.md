# Termo

Termo is a simple terminal emulator that can be used to create a terminal-like interface on your website. It is inspired by the terminal emulator in [stripe.dev](https://stripe.dev). It is an wrapper on top of xterm.js.

<img src="finaltermo.gif"/>

---

### Demo

Check out the [demo and documentation](https://rajnandan1.github.io/termo/).

### Features

- [x] Customizable terminal title, prompt, font, and theme
- [x] Set a welcome message for the terminal
- [x] Add and execute any javascript as commands
- [x] Control sound effects
- [x] Get full access to the terminal (xterm.js)
- [x] Set terminal to dock/floating mode

### Installation

- [CDN](#cdn)
- [NPM](#npm)

Include the following script tag in your HTML file.

```html
<script src="https://cdn.jsdelivr.net/gh/rajnandan1/termo/dist/termo.min.js"></script>
```

Install the package using npm.

```bash
npm install @rajnandan1/termo
```

### Quick Start

Create a new instance of Termo by passing an object .

```js
const myTermo = new termo({
    title: 'Termo',
    welcomeMessage: 'Welcome to Termo',
    commands: [
        {
            command: 'hello',
            description: 'Says hello',
            action: async (terminal, args) => terminal.write('\r\nHello! ' + args.join(' ')),
        },
    ],
});
myTermo.create();
myTermo.show();
```

### Complete Example

Here is a complete example of how to create a terminal with a custom command.

```js
import { termo } from 'termo';

let commands = [
    {
        command: 'hello',
        description: 'Says hello',
        action: async (terminal, args) => terminal.write('\r\nHello! ' + args.join(' ')),
    },
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
    {
        command: 'theme',
        description: 'Change the website theme',
        subCommands: [
            {
                command: 'set',
                description: 'Set the website theme to light or dark',
                action: async (terminal, args) => {
                    let theme = args[0];
                    if (theme === 'light') {
                        document.body.setAttribute('data-bs-theme', 'light');
                    } else {
                        document.body.setAttribute('data-bs-theme', 'dark');
                    }
                    terminal.write('\r\nsetting theme to ' + args[0]);
                },
            },
            {
                command: 'list',
                description: 'List all available themes',
                action: async (terminal, args) => {
                    let list = ['light', 'dark'];
                    list.forEach((theme) => {
                        terminal.write('\r\n' + theme);
                    });
                },
            },
        ],
    },
];

let myDemoTerminal = new termo({
    commands: commands,
    title: 'Termo v0.0.2',
    theme: 'dark',
    prompt: '$',
});

myDemoTerminal.create();

myDemoTerminal.show();
```

### Options

Termo accepts an object with the following options.

```js
/**
	* Configuration options for initializing the terminal
	* @interface InitOptions
	*
	* @property {boolean} [playSound=true] - Enable/disable terminal sound effects
	* @property {string} [title='termo'] - Terminal window title
	* @property {string} [welcomeMessage] - Initial message displayed when terminal opens
	* @property {'light' | 'dark'} [theme='light'] - Terminal color theme
	* @property {string} [fontFamily='Courier New, monospace'] - Font family for terminal text
	* @property {string} [prompt='$'] - Terminal prompt character
	* @property {Command[]} [commands=[]] - Array of available terminal commands
	* @property {ITerminalOptions} [terminalOptions] - XTerm.js specific terminal options
	*
	* @example
	* const options: InitOptions = {
	*   playSound: true,
	*   title: 'My Terminal',
	*   theme: 'dark',
	*   commands: [{
	*     command: 'hello',
	*     description: 'Says hello',
	*     action: async (terminal, args) => terminal.write('\r\nHello! ' + args.join(' ')),
	*   }]
	* };
	*/
export interface InitOptions {
	playSound?: boolean;
	title?: string;
	welcomeMessage?: string;
	theme?: 'light' | 'dark';
	id?: string;
	fontFamily?: string;
	prompt?: string;
	commands?: Command[];
	terminalOptions?: ITerminalOptions;
}
```

### Command

Command object for defining terminal commands.

```js
/**
* Represents a terminal command with its description, action and optional subcommands
* @interface Command
*
* @property {string} command - The command name/identifier
* @property {string} description - Brief description of what the command does
* @property {function} action - Async function to execute when command is invoked
* @property {Command[]} [subCommands] - Optional array of nested subcommands
*
* @example
* const myCommand: Command = {
*   command: 'git',
*   description: 'Git version control',
*   action: async (terminal, args) => {
*     terminal.write('Executing git command...\r\n');
*   },
*   subCommands: [{
*     command: 'status',
*     description: 'Show working tree status',
*     action: async (terminal) => {
*       terminal.write('git status output...\r\n');
*     }
*   }]
* };
*/
export interface Command {
	command: string;
	description: string;
	action: (terminal: Terminal, args: string[]) => Promise;
	subCommands?: Command[];
}
```

### API

Termo exposes the following methods and variable.

```js
const myTermo = new termo({
    title: 'Termo',
});
```

#### Methods

Termo has the following methods.

```js
/**
 * Creates a new terminal instance with the specified options.
 *
 * This method initializes the terminal container, header, and various control buttons
 * (resize, close). It also sets up event listeners for these buttons to handle terminal
 * resizing and closing actions. The terminal is appended to the document body and made
 * draggable.
 *
 * @throws {Error} If a terminal with the same title already exists.
 */
myTermo.create();

/**
 * Displays the terminal by applying a scale transformation to the container element.
 * If the container exists, it plays the terminal open sound, sets the state to 'open',
 * and focuses the terminal. If the container does not exist, it throws an error.
 *
 * @throws {Error} If the terminal container is not created.
 */
myTermo.show();

/**
 * Hides the terminal by scaling down its container element.
 * If the container exists, it plays the terminal close sound,
 * scales the container to zero, and updates the state to 'minimized'.
 * If the container does not exist, it throws an error.
 *
 * @throws {Error} If the terminal container is not created.
 */
myTermo.hide(); // Hides the terminal

/**
 * Sets the theme of the terminal.
 *
 * @param theme - The theme to set, either 'dark' or 'light'.
 * @throws Will throw an error if the terminal container is not created.
 */
myTermo.setTheme();

/**
 * Destroys the terminal instance by performing the following actions:
 * - If the container exists:
 *   - Destroys the terminal manager.
 *   - Removes the container element from the document body.
 *   - Removes the associated stylesheet from the document head.
 *   - Sets the container to undefined.
 *   - Deletes the terminal manager.
 *   - Updates the state to 'destroyed'.
 *   - Sets the mode to 'floating'.
 * - If the container does not exist, throws an error indicating that the terminal was not created.
 *
 * @throws {Error} If the terminal was not created.
 */
myTermo.destroy();

/**
 * Adjusts the dimensions and position of the terminal container to dock it
 * at the bottom right corner of the viewport.
 *
 * @throws {Error} Throws an error if the terminal container is not created.
 */
myTermo.dock();

/**
 * Adjusts the dimensions and position of the container element to float it
 * at a specific size and position on the screen. If the container element
 * is not available, an error is thrown.
 *
 * @throws {Error} If the container element is not created.
 */
myTermo.float();
```

#### Variables

Termo has the following variables.

```js
/**
 * @class Termo
 * @property {InitOptions} options - The initialization options for the terminal.
 * @property {'floating' | 'docked'} mode - The current mode of the terminal (floating or docked).
 * @property {'minimized' | 'open' | 'destroyed' | 'initiated'} state - The current state of the terminal.
 * @property {HTMLDivElement | undefined} container - The container element for the terminal.
 * @property {TerminalManager | undefined} terminalManager - The terminal manager instance.
 */
```

import { InitOptions, Terminal } from './interfaces';
import { close, dock, pop } from './svgs';
import DOM from './dom';
import Utils from './utils';
import Sounds from './sounds';
import Stylesheet from './stylesheet';
import TerminalManager from './terminal';

/**
 * @class Termo
 * @property {InitOptions} options - The initialization options for the terminal.
 * @property {'floating' | 'docked'} mode - The current mode of the terminal (floating or docked).
 * @property {'minimized' | 'open' | 'destroyed' | 'initiated'} state - The current state of the terminal.
 * @property {HTMLDivElement | undefined} container - The container element for the terminal.
 * @property {TerminalManager | undefined} terminalManager - The terminal manager instance.
 */
class Termo {
    options: InitOptions;
    mode: 'floating' | 'docked';
    state: 'minimized' | 'open' | 'destroyed' | 'initiated';
    container: HTMLDivElement | undefined;
    terminalManager: TerminalManager | undefined;
    terminal: Terminal;

    //define constructor arguments

    constructor(options: InitOptions) {
        if (!!!options.title) {
            throw new Error('title is required');
        }
        options.id = Utils.titleID(options.title);
        this.options = Utils.getInitOptions(options);
        this.mode = 'floating';
        this.state = 'initiated';
        this.container = undefined;
        this.terminal = new Terminal(this.options.terminalOptions);
    }

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
    create() {
        //define show method
        let containerID = `termo-${this.options.id}-container`;

        let existingContainer = document.querySelector(`#${containerID}`);
        if (existingContainer) {
            throw new Error('Terminal with the same title already exists');
        }
        const styleSheet = Stylesheet(this.options);
        DOM.injectStylesheet(this.options.id, styleSheet);

        this.container = DOM.createDiv(containerID, 'termo-container');
        this.container.setAttribute('mode', this.mode);

        let headerID = Utils.generateId('termo-header');
        let header = DOM.createDiv(headerID, 'termo-header');
        if (this.options.theme === 'dark') {
            this.container.classList.add('darker');
        }

        let resizeButton = DOM.createDiv(Utils.generateId('termo-resize-button'), 'termo-resize-button');
        resizeButton.innerHTML = dock;
        DOM.appendChild(header, resizeButton);
        resizeButton.addEventListener('click', () => {
            if (this.container) {
                this.container.style.removeProperty('left');
                this.container.style.removeProperty('top');

                if (this.mode == 'floating') {
                    this.dock();
                    this.mode = 'docked';
                    resizeButton.innerHTML = pop;
                } else {
                    this.float();
                    this.mode = 'floating';
                    resizeButton.innerHTML = dock;
                }
                //terminalManager.terminal.focus();
            }
        });

        let titleDiv = DOM.createDiv(Utils.generateId('termo-title'), 'termo-title');
        titleDiv.innerHTML = this.options.title;
        DOM.appendChild(header, titleDiv);

        let closeButton = DOM.createDiv(Utils.generateId('termo-close-button'), 'termo-close-button');
        closeButton.innerHTML = close;
        DOM.appendChild(header, closeButton);
        //add a click event to close the terminal
        closeButton.addEventListener('click', () => {
            this.hide();
        });

        // Append the header to the container
        DOM.appendChild(this.container, header);

        let terminalID = Utils.generateId('termo-terminal');
        let terminal = DOM.createDiv(terminalID, 'termo-terminal');
        DOM.appendChild(this.container, terminal);
        this.container.style.transform = 'scale(0)';
        DOM.appendChild(document.body, this.container);
        Utils.containerDraggable(this.container, header);
        this.container.style.bottom = '12px';
        this.container.style.right = '12px';

        this.terminalManager = new TerminalManager(terminal, this.options);
        this.terminal = this.terminalManager.terminal;
        this.state = 'minimized';
    }

    /**
     * Adjusts the dimensions and position of the container element to float it
     * at a specific size and position on the screen. If the container element
     * is not available, an error is thrown.
     *
     * @throws {Error} If the container element is not created.
     */
    float() {
        if (this.container) {
            this.container.style.width = '705px';
            this.container.style.height = '482px';
            this.container.style.right = '12px';
            this.container.style.bottom = '12px';
            this.container.setAttribute('mode', 'floating');
            this.terminalManager?.resize();
        } else {
            throw new Error('Terminal not created');
        }
    }

    /**
     * Adjusts the dimensions and position of the terminal container to dock it
     * at the bottom right corner of the viewport.
     *
     * @throws {Error} Throws an error if the terminal container is not created.
     */
    dock() {
        if (this.container) {
            this.container.style.height = '300px';
            this.container.style.width = '100vw';
            this.container.style.right = '0px';
            this.container.style.bottom = '0px';
            this.container.setAttribute('mode', 'docked');
            this.terminalManager?.resize();
        } else {
            throw new Error('Terminal not created');
        }
    }
    /**
     * Hides the terminal by scaling down its container element.
     * If the container exists, it plays the terminal close sound,
     * scales the container to zero, and updates the state to 'minimized'.
     * If the container does not exist, it throws an error.
     *
     * @throws {Error} If the terminal container is not created.
     */
    hide() {
        if (this.container) {
            Sounds.terminalClose(this.options);
            this.container.style.transform = 'scale(0)';
            this.state = 'minimized';
        } else {
            throw new Error('Terminal not created');
        }
    }
    /**
     * Displays the terminal by applying a scale transformation to the container element.
     * If the container exists, it plays the terminal open sound, sets the state to 'open',
     * and focuses the terminal. If the container does not exist, it throws an error.
     *
     * @throws {Error} If the terminal container is not created.
     */
    show() {
        if (this.container) {
            Sounds.terminalOpen(this.options);
            this.container.style.transform = 'scale(1)';
            this.state = 'open';
            this.terminalManager?.terminal.focus();
        } else {
            throw new Error('Terminal not created');
        }
    }

    /**
     * Sets the theme of the terminal.
     *
     * @param theme - The theme to set, either 'dark' or 'light'.
     * @throws Will throw an error if the terminal container is not created.
     */
    setTheme(theme: 'dark' | 'light') {
        if (this.container) {
            if (theme === 'dark') {
                this.container.classList.add('darker');
            } else {
                this.container.classList.remove('darker');
            }
        } else {
            throw new Error('Terminal not created');
        }
    }

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
    destroy() {
        if (this.container) {
            this.terminalManager?.destroy();
            document.body.removeChild(this.container);
            //remove the stylesheet also
            document.head.removeChild(document.getElementById(this.options.id) as HTMLStyleElement);
            this.container = undefined;
            delete this.terminalManager;
            this.state = 'destroyed';
            this.mode = 'floating';
        } else {
            throw new Error('Terminal not created');
        }
    }
}

export default Termo;

export interface TerminalManagerReturn {
    terminal: Terminal;
    destroy: () => void;
}

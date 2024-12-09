import { InitOptions, TerminalManagerReturn } from './types';
import { close, dock, pop } from './svgs';
import DOM from './dom';
import Utils from './utils';
import Sounds from './sounds';
import Stylesheet from './stylesheet';
import TerminalManager from './terminal';

class Termo {
    options: InitOptions;
    mode: 'floating' | 'docked';
    state: 'minimized' | 'open' | 'destroyed' | 'initiated';
    container: HTMLDivElement | undefined;
    terminalManager: TerminalManager | undefined;

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
        this.state = 'minimized';
    }

    float() {
        if (this.container) {
            this.container.style.width = '705px';
            this.container.style.height = '482px';
            this.container.style.right = '12px';
            this.container.style.bottom = '12px';
        } else {
            throw new Error('Terminal not created');
        }
    }

    dock() {
        if (this.container) {
            this.container.style.height = '300px';
            this.container.style.width = '100vw';
            this.container.style.right = '0px';
            this.container.style.bottom = '0px';
        } else {
            throw new Error('Terminal not created');
        }
    }

    hide() {
        if (this.container) {
            Sounds.terminalClose(this.options);
            this.container.style.transform = 'scale(0)';
            this.state = 'minimized';
        } else {
            throw new Error('Terminal not created');
        }
    }
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

import { InitOptions } from './interfaces';
import TerminalManager from './terminal';
/**
 * @class Termo
 * @property {InitOptions} options - The initialization options for the terminal.
 * @property {'floating' | 'docked'} mode - The current mode of the terminal (floating or docked).
 * @property {'minimized' | 'open' | 'destroyed' | 'initiated'} state - The current state of the terminal.
 * @property {HTMLDivElement | undefined} container - The container element for the terminal.
 * @property {TerminalManager | undefined} terminalManager - The terminal manager instance.
 */
declare class Termo {
    options: InitOptions;
    mode: 'floating' | 'docked';
    state: 'minimized' | 'open' | 'destroyed' | 'initiated';
    container: HTMLDivElement | undefined;
    terminalManager: TerminalManager | undefined;
    constructor(options: InitOptions);
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
    create(): void;
    /**
     * Adjusts the dimensions and position of the container element to float it
     * at a specific size and position on the screen. If the container element
     * is not available, an error is thrown.
     *
     * @throws {Error} If the container element is not created.
     */
    float(): void;
    /**
     * Adjusts the dimensions and position of the terminal container to dock it
     * at the bottom right corner of the viewport.
     *
     * @throws {Error} Throws an error if the terminal container is not created.
     */
    dock(): void;
    /**
     * Hides the terminal by scaling down its container element.
     * If the container exists, it plays the terminal close sound,
     * scales the container to zero, and updates the state to 'minimized'.
     * If the container does not exist, it throws an error.
     *
     * @throws {Error} If the terminal container is not created.
     */
    hide(): void;
    /**
     * Displays the terminal by applying a scale transformation to the container element.
     * If the container exists, it plays the terminal open sound, sets the state to 'open',
     * and focuses the terminal. If the container does not exist, it throws an error.
     *
     * @throws {Error} If the terminal container is not created.
     */
    show(): void;
    /**
     * Sets the theme of the terminal.
     *
     * @param theme - The theme to set, either 'dark' or 'light'.
     * @throws Will throw an error if the terminal container is not created.
     */
    setTheme(theme: 'dark' | 'light'): void;
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
    destroy(): void;
}
export default Termo;
//# sourceMappingURL=index.d.ts.map
import { InitOptions } from './types';
import { close, dock, pop } from './svgs';
import DOM from './dom';
import Utils from './utils';
import Sounds from './sounds';
import Stylesheet from './stylesheet';
import TerminalManager from './terminal';

export function LetsGo(options: InitOptions) {
    options = Utils.getInitOptions(options);

    const styleSheet = Stylesheet(options);
    DOM.injectStylesheet(styleSheet);

    // Create the container
    let containerID = Utils.generateId('jerminal-container');
    let container = DOM.createDiv(containerID, 'jerminal-container');

    // Create the header
    let headerID = Utils.generateId('jerminal-header');
    let header = DOM.createDiv(headerID, 'jerminal-header');
    if (options.theme === 'dark') {
        container.classList.add('dark');
    }

    let mode = 'floating';
    let state = 'closed';
    // Create the resize button
    let resizeButton = DOM.createDiv(Utils.generateId('jerminal-resize-button'), 'jerminal-resize-button');
    resizeButton.innerHTML = dock;
    DOM.appendChild(header, resizeButton);
    //add a click event to resize the terminal
    resizeButton.addEventListener('click', () => {
        container.style.removeProperty('top');
        container.style.removeProperty('left');
        if (mode == 'floating') {
            container.style.height = '300px';
            container.style.width = '100vw';
            container.style.right = '0px';
            container.style.bottom = '0px';

            mode = 'docked';
            resizeButton.innerHTML = pop;
        } else {
            container.style.width = '705px';
            container.style.height = '482px';
            container.style.right = '12px';
            container.style.bottom = '12px';

            mode = 'floating';
            resizeButton.innerHTML = dock;
        }
        terminalManager.focus();
    });

    // Create title div
    let titleDiv = DOM.createDiv(Utils.generateId('jerminal-title'), 'jerminal-title');
    titleDiv.innerHTML = 'Jerminal';
    DOM.appendChild(header, titleDiv);

    // Create the close button
    let closeButton = DOM.createDiv(Utils.generateId('jerminal-close-button'), 'jerminal-close-button');
    closeButton.innerHTML = close;
    DOM.appendChild(header, closeButton);
    //add a click event to close the terminal
    closeButton.addEventListener('click', () => {
        hide();
    });

    // Append the header to the container
    DOM.appendChild(container, header);

    // Create the terminal
    let terminalID = Utils.generateId('jerminal-terminal');
    let terminal = DOM.createDiv(terminalID, 'jerminal-terminal');
    DOM.appendChild(container, terminal);
    container.style.transform = 'scale(0)';
    DOM.appendChild(document.body, container);

    //make container draggable

    const terminalManager = TerminalManager(terminal, options);
    Utils.containerDraggable(container, header);
    container.style.bottom = '12px';
    container.style.right = '12px';

    //check if hotKey is there, if yes add event listener
    if (!!options.hotKey) {
        window.addEventListener('keydown', (e) => {
            if (e.key === options.hotKey) {
                if (state === 'closed') {
                    e.preventDefault();
                    show();
                }
            }
        });
    }

    function show() {
        Sounds.terminalOpen(options);
        container.style.transform = 'scale(1)';
        terminalManager.focus();
        state = 'open';
    }

    function hide() {
        state = 'closed';
        Sounds.terminalClose(options);
        container.style.transform = 'scale(0)';
    }

    function setTheme(theme: 'dark' | 'light') {
        if (theme === 'dark') {
            container.classList.add('dark');
        } else {
            container.classList.remove('dark');
        }
    }

    return {
        show: show,
        hide: hide,
        terminal: terminalManager,
        setTheme,
    };
}

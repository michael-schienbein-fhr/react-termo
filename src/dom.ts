import Stylesheet from './stylesheet';

const DOM = {
    createDiv(id: string, cls: string): HTMLDivElement {
        const div = document.createElement('div');
        div.id = id;
        div.className = cls;
        return div;
    },
    addCss(div: HTMLDivElement, css: string): void {
        div.style.cssText = css;
    },
    appendChild(parent: HTMLElement, child: HTMLElement): void {
        parent.appendChild(child);
    },
    injectStylesheet(id: string, styleSheet: string): void {
        //check if stylesheet is already injected
        if (document.querySelector('#' + id)) {
            return;
        }
        const style = document.createElement('style');
        style.id = id;
        style.innerHTML = styleSheet;
        document.head.appendChild(style);
    },
};

export default DOM;

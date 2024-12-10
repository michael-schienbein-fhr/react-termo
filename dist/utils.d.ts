import { InitOptions } from './interfaces';
declare const Utils: {
    generateId(prefix: string): string;
    containerDraggable(container: HTMLElement, header: HTMLElement): void;
    getBottomRightPosition(): {
        top: number;
        left: number;
    };
    playAudio(filePath: string): void;
    getInitOptions(opts: InitOptions): InitOptions;
    titleID(title: string): string;
};
export default Utils;
//# sourceMappingURL=utils.d.ts.map
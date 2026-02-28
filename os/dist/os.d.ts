declare enum PositionMode {
    INLINE = 0,
    ABSOLUTE = 1
}
declare enum FileTypes {
    TEXT = 0,
    FOLDER = 1,
    IMAGE = 2,
    DRIVE = 3
}
declare class BaseFile {
    system: System;
    element: HTMLElement;
    name: string;
    nameElement: HTMLElement;
    iconElement: HTMLElement;
    offsetX: number;
    offsetY: number;
    beingDragged: boolean;
    constructor(system: System, fileTemplate: HTMLTemplateElement, name: string, mode: PositionMode, x?: number, y?: number);
    moveFile(x: number, y: number): void;
    onDragEnd(ev: DragEvent): void;
    onDragEnter(ev: DragEvent): void;
    onDragLeave(ev: DragEvent): void;
    onDragOver(ev: DragEvent): void;
}
declare class Directory {
    files: Array<BaseFile>;
    element: HTMLElement;
    constructor(directoryTemplate: HTMLTemplateElement);
    addFile(file: BaseFile): void;
    getFile(name: string): BaseFile | undefined;
    reorderFile(name: string): void;
    private reorderFileObj;
    moveFile(name: string, x: number, y: number): void;
    removeFile(name: string): BaseFile | undefined;
    clear(): void;
    onFocusIn(ev: FocusEvent): void;
}
declare class Text extends BaseFile {
    private content;
    constructor(system: System, fileTemplate: HTMLTemplateElement, name: string, content: string, mode: PositionMode, x: number, y: number);
    changeContent(newContent: string): void;
    onDragStart(ev: DragEvent): void;
    onDrop(ev: DragEvent): void;
}
declare class Folder extends BaseFile {
}
declare class Image extends BaseFile {
}
declare class Drive extends BaseFile {
}
declare class Window {
    manager: WindowManager;
    directory: Directory;
    element: HTMLElement;
    nameElement: HTMLElement;
    closeElement: HTMLElement;
    headerElement: HTMLElement;
    name: string;
    offsetX: number;
    offsetY: number;
    dragging: boolean;
    constructor(manager: WindowManager, windowTemplate: HTMLTemplateElement, directoryTemplate: HTMLTemplateElement, name: string, x: number, y: number);
    moveWindow(x: number, y: number): void;
    onClose(ev: MouseEvent): void;
    onDragStart(ev: MouseEvent): void;
    onMouseMove(ev: MouseEvent): void;
    onDragEnd(ev: MouseEvent): void;
    onClick(ev: MouseEvent): void;
}
declare class WindowManager {
    windows: Array<Window>;
    element: HTMLElement;
    windowTemplate: HTMLTemplateElement;
    directoryTemplate: HTMLTemplateElement;
    constructor(element: HTMLElement, windowTemplate: HTMLTemplateElement, directoryTemplate: HTMLTemplateElement);
    addWindow(name: string, x: number, y: number): void;
    addWindowObject(window: Window): void;
    getWindow(name: string): Window | undefined;
    removeWindow(name: string): void;
    removeWindowObject(window: Window): void;
    clear(): void;
}
declare class System {
    directory: Directory;
    windowManager: WindowManager;
    private systemTemplate;
    private fileTemplate;
    private directoryTemplate;
    private windowTemplate;
    element: HTMLElement;
    mouseX: number;
    mouseY: number;
    constructor(systemTemplate: HTMLTemplateElement, fileTemplate: HTMLTemplateElement, directoryTemplate: HTMLTemplateElement, windowTemplate: HTMLTemplateElement);
    addWindow(name: string, x: number, y: number): void;
    addFile(name: string, type: FileTypes): BaseFile;
    removeFile(name: string): void;
    moveFile(name: string, x: number, y: number): void;
    appendSystem(element: HTMLElement): void;
    onDragOver(ev: DragEvent): void;
    onDrop(ev: DragEvent): void;
    onMouseMove(ev: MouseEvent): void;
}
export { Text, Folder, Image, Drive, System, FileTypes };
//# sourceMappingURL=os.d.ts.map
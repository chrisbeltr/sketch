declare enum PositionMode {
    INLINE = 0,
    ABSOLUTE = 1
}
declare class BaseFile {
    element: HTMLElement;
    name: string;
    nameElement: HTMLElement;
    iconElement: HTMLElement;
    private offsetX;
    private offsetY;
    private beingDragged;
    constructor(fileTemplate: HTMLTemplateElement, name: string, mode: PositionMode, x?: number, y?: number);
    moveFile(x: number, y: number): void;
    onDragStart(ev: DragEvent): void;
    onDragEnd(ev: DragEvent): void;
    onDragEnter(ev: DragEvent): void;
    onDragLeave(ev: DragEvent): void;
    onDragOver(ev: DragEvent): void;
    onDrop(ev: DragEvent): void;
}
declare class Text extends BaseFile {
    private content;
    constructor(fileTemplate: HTMLTemplateElement, name: string, content: string, mode: PositionMode, x: number, y: number);
    changeContent(newContent: string): void;
}
declare class Folder extends BaseFile {
}
declare class Image extends BaseFile {
}
declare class Drive extends BaseFile {
}
declare class System {
    private directory;
    private systemTemplate;
    private fileTemplate;
    element: HTMLElement;
    mouseX: number;
    mouseY: number;
    constructor(systemTemplate: HTMLTemplateElement, fileTemplate: HTMLTemplateElement);
    addFile(name: string): BaseFile;
    removeFile(name: string): void;
    moveFile(name: string, x: number, y: number): void;
    appendSystem(element: HTMLElement): void;
    onDragOver(ev: DragEvent): void;
    onDrop(ev: DragEvent): void;
    onMouseMove(ev: MouseEvent): void;
}
export { Text, Folder, Image, Drive, System };
//# sourceMappingURL=os.d.ts.map
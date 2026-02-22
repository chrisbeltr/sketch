declare class File {
    element: HTMLElement;
    name: string;
    nameElement: HTMLElement;
    constructor(fileTemplate: HTMLTemplateElement, name: string);
}
declare class Text extends File {
    private content;
    constructor(fileTemplate: HTMLTemplateElement, name: string, content: string);
    changeContent(newContent: string): void;
}
declare class Folder extends File {
}
declare class Image extends File {
}
declare class Drive extends File {
}
declare class System {
    private directory;
    private systemTemplate;
    private fileTemplate;
    element: HTMLElement;
    constructor(systemTemplate: HTMLTemplateElement, fileTemplate: HTMLTemplateElement);
    addFile(name: string): File;
    appendSystem(element: HTMLElement): void;
}
export { Text, Folder, Image, Drive, System };
//# sourceMappingURL=os.d.ts.map
declare class File {
    element: HTMLElement;
    name: String;
    constructor(fileTemplate: HTMLTemplateElement, name: String);
}
declare class Text extends File {
    private content;
    constructor(fileTemplate: HTMLTemplateElement, name: String, content: String);
    changeContent(newContent: String): void;
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
    addFile(name: String): File;
    appendSystem(element: HTMLElement): void;
}
export { Text, Folder, Image, Drive, System };
//# sourceMappingURL=os.d.ts.map
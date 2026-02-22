class File {
    constructor(fileTemplate, name) {
        this.element = document
            .importNode(fileTemplate, true)
            .content.querySelector(".file");
        this.nameElement = this.element.querySelector(".file-name");
        this.name = name;
        this.nameElement.textContent = name;
    }
}
class Directory {
    constructor() {
        this.files = [];
    }
    addFile(file) {
        this.files.push(file);
    }
    getFile(name) {
        return this.files.find((v) => {
            v.name == name;
        });
    }
}
class Text extends File {
    constructor(fileTemplate, name, content) {
        super(fileTemplate, name);
        this.content = content;
    }
    changeContent(newContent) {
        this.content = newContent;
    }
}
class Folder extends File {
}
class Image extends File {
}
class Drive extends File {
}
class System {
    constructor(systemTemplate, fileTemplate) {
        this.systemTemplate = systemTemplate;
        this.fileTemplate = fileTemplate;
        this.directory = new Directory();
        this.element = document
            .importNode(systemTemplate, true)
            .content.querySelector(".system");
    }
    addFile(name) {
        let file = new File(this.fileTemplate, name);
        this.directory.addFile(file);
        this.element.appendChild(file.element);
        return file;
    }
    appendSystem(element) {
        element.appendChild(this.element);
    }
}
export { Text, Folder, Image, Drive, System };
//# sourceMappingURL=os.js.map
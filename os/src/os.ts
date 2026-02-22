class File {
  element: HTMLElement;
  name: string;
  nameElement: HTMLElement;

  constructor(fileTemplate: HTMLTemplateElement, name: string) {
    this.element = document
      .importNode(fileTemplate, true)
      .content.querySelector(".file")!;
    this.nameElement = this.element.querySelector(".file-name")!;
    this.name = name;
    this.nameElement.textContent = name;
  }
}

class Directory {
  private files: Array<File> = [];

  addFile(file: File) {
    this.files.push(file);
  }

  getFile(name: string) {
    return this.files.find((v) => {
      v.name == name;
    });
  }
}

class Text extends File {
  private content: string;

  constructor(
    fileTemplate: HTMLTemplateElement,
    name: string,
    content: string,
  ) {
    super(fileTemplate, name);
    this.content = content;
  }

  changeContent(newContent: string) {
    this.content = newContent;
  }
}
class Folder extends File {}
class Image extends File {}
class Drive extends File {}

class System {
  private directory: Directory;
  private systemTemplate: HTMLTemplateElement;
  private fileTemplate: HTMLTemplateElement;
  element: HTMLElement;

  constructor(
    systemTemplate: HTMLTemplateElement,
    fileTemplate: HTMLTemplateElement,
  ) {
    this.systemTemplate = systemTemplate;
    this.fileTemplate = fileTemplate;
    this.directory = new Directory();
    this.element = document
      .importNode(systemTemplate, true)
      .content.querySelector(".system")!;
  }

  addFile(name: string) {
    let file = new File(this.fileTemplate, name);
    this.directory.addFile(file);
    this.element.appendChild(file.element);

    return file;
  }

  appendSystem(element: HTMLElement) {
    element.appendChild(this.element);
  }
}

export { Text, Folder, Image, Drive, System };

// util functions

// clamp between `min` and `max`
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

enum PositionMode {
  INLINE,
  ABSOLUTE,
}

enum Z {
  SYSTEM,
  FILES,
  UI,
}

enum Colors {
  TEXT,
  FOLDER,
  IMAGE,
  DRIVE,
}

interface FileJSONData {
  name: string;
}

class BaseFile {
  element: HTMLElement;
  name: string;
  nameElement: HTMLElement;
  iconElement: HTMLElement;

  private offsetX: number;
  private offsetY: number;
  private beingDragged: boolean;

  constructor(
    fileTemplate: HTMLTemplateElement,
    name: string,
    mode: PositionMode,
    x?: number,
    y?: number,
  ) {
    // initial
    this.offsetX = 0;
    this.offsetY = 0;
    this.beingDragged = false;

    this.element = document
      .importNode(fileTemplate, true)
      .content.querySelector(".file")!;
    this.element.style.zIndex = `${Z.FILES}`;
    this.nameElement = this.element.querySelector(".file-name")!;
    this.iconElement = this.element.querySelector(".file-icon")!;
    this.name = name;
    this.nameElement.textContent = name;

    if (mode == PositionMode.ABSOLUTE && x && y) {
      this.element.style.position = "absolute";
      this.moveFile(x, y);
    }

    // adding handlers
    // this.element.addEventListener("focus", this.onFocus.bind(this));
    // this.element.addEventListener("blur", this.onBlur.bind(this));
    this.element.addEventListener("dragstart", this.onDragStart.bind(this));
    this.element.addEventListener("dragend", this.onDragEnd.bind(this));
    this.element.addEventListener("dragover", this.onDragOver);
    this.element.addEventListener("dragenter", this.onDragEnter.bind(this));
    this.element.addEventListener("dragleave", this.onDragLeave.bind(this));
    this.element.addEventListener("drop", this.onDrop.bind(this));
  }

  moveFile(x: number, y: number) {
    // console.log(`x: ${x + this.offsetX} ,y: ${y + this.offsetY}`);
    // let top = y + this.offsetY;
    // let left = x + this.offsetX;
    let top = clamp(
      y + this.offsetY,
      0,
      window.innerHeight -
        Number(
          window
            .getComputedStyle(document.documentElement)
            .getPropertyValue("--file-height")
            .slice(0, -2),
        ),
    );
    let left = clamp(
      x + this.offsetX,
      0,
      window.innerWidth -
        Number(
          window
            .getComputedStyle(document.documentElement)
            .getPropertyValue("--file-width")
            .slice(0, -2),
        ),
    );
    this.element.style.top = `${top}px`;
    this.element.style.left = `${left}px`;
  }

  // onFocus(ev: FocusEvent) {
  //   this.element.style.zIndex = "1";
  // }
  // onBlur(ev: FocusEvent) {
  //   this.element.style.zIndex = "1";
  // }

  onDragStart(ev: DragEvent) {
    this.element.blur();
    this.offsetX = Number(this.element.style.left.slice(0, -2)) - ev.clientX;
    this.offsetY = Number(this.element.style.top.slice(0, -2)) - ev.clientY;
    ev.dataTransfer!.items.add(`{"name": "${this.name}"}`, "text/plain");
    this.beingDragged = true;
  }
  onDragEnd(ev: DragEvent) {
    this.element.classList.remove("file-no-hover");
    this.beingDragged = false;
    this.element.focus();
  }

  onDragEnter(ev: DragEvent) {
    this.element.classList.add("file-hover");
    if (this.beingDragged) {
      console.log("okay hover!!!!");
      this.element.classList.remove("file-no-hover");
    }
  }
  onDragLeave(ev: DragEvent) {
    this.element.classList.remove("file-hover");
    if (this.beingDragged) {
      console.log("no hover!!!!");
      this.element.classList.add("file-no-hover");
    }
  }

  onDragOver(ev: DragEvent) {
    ev.dataTransfer!.dropEffect = "copy";
    ev.preventDefault();
    ev.stopPropagation();
  }
  onDrop(ev: DragEvent) {
    ev.stopPropagation();
    this.element.classList.remove("file-no-hover");
    this.element.classList.remove("file-hover");
    if (!ev.dataTransfer) return;
    if (this.beingDragged) return;

    for (let i = 0; i < ev.dataTransfer.items.length; i++) {
      let item = ev.dataTransfer.items[i]!;
      if (item.kind === "string") {
        item.getAsString((data) => {
          console.log(`${this.name} received ${data}`);
        });
      }
    }
    this.element.focus();
  }
}

class Directory {
  files: Array<BaseFile> = [];

  addFile(file: BaseFile) {
    let fname = file.name;
    let mod = 1;
    while (this.getFile(fname)) {
      fname = `${fname} (${mod})`;
      mod++;
    }
    file.name = fname;
    file.nameElement.textContent = fname;
    this.files.push(file);
  }

  getFile(name: string) {
    return this.files.find((v) => {
      return v.name == name;
    });
  }

  removeFile(name: string) {
    let file = this.getFile(name);
    if (!file) return;
    return this.files.splice(this.files.indexOf(file))[0];
  }
}

class Text extends BaseFile {
  private content: string;

  constructor(
    fileTemplate: HTMLTemplateElement,
    name: string,
    content: string,
    mode: PositionMode,
    x: number,
    y: number,
  ) {
    super(fileTemplate, name, mode, x, y);
    this.content = content;
  }

  changeContent(newContent: string) {
    this.content = newContent;
  }
}
class Folder extends BaseFile {}
class Image extends BaseFile {}
class Drive extends BaseFile {}

class System {
  private directory: Directory;
  private systemTemplate: HTMLTemplateElement;
  private fileTemplate: HTMLTemplateElement;
  element: HTMLElement;

  mouseX: number;
  mouseY: number;

  constructor(
    systemTemplate: HTMLTemplateElement,
    fileTemplate: HTMLTemplateElement,
  ) {
    this.mouseX = 0;
    this.mouseY = 0;
    this.systemTemplate = systemTemplate;
    this.fileTemplate = fileTemplate;
    this.directory = new Directory();
    this.element = document
      .importNode(systemTemplate, true)
      .content.querySelector(".system")!;
    this.element.style.zIndex = `${Z.SYSTEM}`;

    // event listeners for system
    this.element.addEventListener("dragover", this.onDragOver);
    this.element.addEventListener("drop", this.onDrop.bind(this));
    this.element.addEventListener("mousemove", this.onMouseMove.bind(this));
  }

  addFile(name: string) {
    let file = new BaseFile(
      this.fileTemplate,
      name,
      PositionMode.ABSOLUTE,
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight,
    );
    this.directory.addFile(file);
    this.element.appendChild(file.element);

    return file;
  }

  removeFile(name: string) {
    let file = this.directory.removeFile(name);
    if (!file) return;
    this.element.removeChild(file.element);
  }

  moveFile(name: string, x: number, y: number) {
    let file = this.directory.getFile(name);
    if (!file) return;
    file.moveFile(x, y);
    this.element.removeChild(file.element);
    this.element.appendChild(file.element);
  }

  appendSystem(element: HTMLElement) {
    element.appendChild(this.element);
  }

  onDragOver(ev: DragEvent) {
    ev.dataTransfer!.dropEffect = "move";
    ev.preventDefault();
  }
  onDrop(ev: DragEvent) {
    if (!ev.dataTransfer) return;

    for (let i = 0; i < ev.dataTransfer.items.length; i++) {
      let item = ev.dataTransfer.items[i]!;
      if (item.kind === "string") {
        item.getAsString((data) => {
          let fileData: FileJSONData = JSON.parse(data);
          this.moveFile(fileData.name, ev.clientX, ev.clientY);
        });
      }
    }
  }

  onMouseMove(ev: MouseEvent) {
    // console.log(`mousemove: ${ev.clientX}, ${ev.clientY}`);
    this.mouseX = ev.clientX;
    this.mouseY = ev.clientY;
  }
}

export { Text, Folder, Image, Drive, System };

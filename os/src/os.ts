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

enum FileTypes {
  TEXT,
  FOLDER,
  IMAGE,
  DRIVE,
}

interface FileJSONData {
  name: string;
  type: FileTypes | null;
}

class BaseFile {
  system: System;
  element: HTMLElement;
  name: string;
  nameElement: HTMLElement;
  iconElement: HTMLElement;

  offsetX: number;
  offsetY: number;
  beingDragged: boolean;

  constructor(
    system: System,
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

    this.system = system;
    this.element = document
      .importNode(fileTemplate, true)
      .content.querySelector(".file")!;
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
    // this.element.addEventListener("dragstart", this.onDragStart.bind(this));
    this.element.addEventListener("dragend", this.onDragEnd.bind(this));
    this.element.addEventListener("dragover", this.onDragOver);
    this.element.addEventListener("dragenter", this.onDragEnter.bind(this));
    this.element.addEventListener("dragleave", this.onDragLeave.bind(this));
    // this.element.addEventListener("drop", this.onDrop.bind(this));
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

  // onDragStart(ev: DragEvent) {
  //   this.element.blur();
  //   this.offsetX = Number(this.element.style.left.slice(0, -2)) - ev.clientX;
  //   this.offsetY = Number(this.element.style.top.slice(0, -2)) - ev.clientY;
  //   let fileData: FileJSONData = { name: this.name, type: null };
  //   ev.dataTransfer!.items.add(JSON.stringify(fileData), "text/plain");
  //   this.beingDragged = true;
  // }
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
  // onDrop(ev: DragEvent) {
  //   ev.stopPropagation();
  //   this.element.classList.remove("file-no-hover");
  //   this.element.classList.remove("file-hover");
  //   if (!ev.dataTransfer) return;
  //   if (this.beingDragged) return;

  //   for (let i = 0; i < ev.dataTransfer.items.length; i++) {
  //     let item = ev.dataTransfer.items[i]!;
  //     if (item.kind === "string") {
  //       item.getAsString((data) => {
  //         // let newData: FileJSONData = JSON.parse(data);
  //         // newData.from = this.name;
  //         // let dataString = JSON.stringify(newData);
  //         // ev.dataTransfer!.items.clear();
  //         // ev.dataTransfer!.items.add(dataString, "text/plain");
  //         console.log(`${this.name} received ${data}`);
  //         // let fileData: FileJSONData = JSON.parse(data);
  //         // this.system.directory.getFile(fileData.name);
  //         // this.system.addWindow()
  //       });
  //     }
  //   }
  //   this.element.focus();
  // }
}

class Directory {
  files: Array<BaseFile> = [];
  element: HTMLElement;

  constructor(directoryTemplate: HTMLTemplateElement) {
    this.element = document
      .importNode(directoryTemplate, true)
      .content.querySelector(".directory")!;
    this.element.style.zIndex = `${Z.FILES}`;
    this.element.addEventListener("focusin", this.onFocusIn.bind(this));
  }

  addFile(file: BaseFile) {
    let fname = file.name;
    let mod = 1;
    while (this.getFile(fname)) {
      fname = `${fname} (${mod})`;
      mod++;
    }
    file.name = fname;
    file.nameElement.textContent = fname;
    this.element.appendChild(file.element);
    this.files.push(file);
  }

  getFile(name: string) {
    return this.files.find((v) => {
      return v.name == name;
    });
  }

  reorderFile(name: string) {
    let file = this.getFile(name);
    if (!file) return;
    if (Array.from(this.element.children).slice(-1)[0] == file.element) {
      return;
    }
    this.element.removeChild(file.element);
    this.element.appendChild(file.element);
    file.element.focus();
  }

  private reorderFileObj(file: BaseFile) {
    this.element.removeChild(file.element);
    this.element.appendChild(file.element);
  }

  moveFile(name: string, x: number, y: number) {
    let file = this.getFile(name);
    if (!file) return;
    file.moveFile(x, y);
    this.reorderFileObj(file);
  }

  removeFile(name: string) {
    let file = this.getFile(name);
    if (!file) return;
    this.element.removeChild(file.element);
    return this.files.splice(this.files.indexOf(file))[0];
  }

  clear() {
    this.element.innerText = "";
  }

  onFocusIn(ev: FocusEvent) {
    this.reorderFile(
      (ev.target as HTMLElement).querySelector(".file-name")!.textContent,
    );
  }
}

class Text extends BaseFile {
  private content: string;

  constructor(
    system: System,
    fileTemplate: HTMLTemplateElement,
    name: string,
    content: string,
    mode: PositionMode,
    x: number,
    y: number,
  ) {
    super(system, fileTemplate, name, mode, x, y);
    this.content = content;

    this.element.addEventListener("dragstart", this.onDragStart.bind(this));
    this.element.addEventListener("drop", this.onDrop.bind(this));
  }

  changeContent(newContent: string) {
    this.content = newContent;
  }

  onDragStart(ev: DragEvent): void {
    this.element.blur();
    this.offsetX = Number(this.element.style.left.slice(0, -2)) - ev.clientX;
    this.offsetY = Number(this.element.style.top.slice(0, -2)) - ev.clientY;
    let fileData: FileJSONData = { name: this.name, type: FileTypes.TEXT };
    ev.dataTransfer!.items.add(JSON.stringify(fileData), "text/plain");
    this.beingDragged = true;
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
          // let newData: FileJSONData = JSON.parse(data);
          // newData.from = this.name;
          // let dataString = JSON.stringify(newData);
          // ev.dataTransfer!.items.clear();
          // ev.dataTransfer!.items.add(dataString, "text/plain");
          console.log(`${this.name} received ${data}`);
          let fileData: FileJSONData = JSON.parse(data);
          let file = this.system.directory.getFile(fileData.name);
          this.system.addWindow(
            file!.name,
            (Math.random() * window.innerWidth) / 2,
            (Math.random() * window.innerHeight) / 2,
          );
        });
      }
    }
    this.element.focus();
  }
}
class Folder extends BaseFile {}
class Image extends BaseFile {}
class Drive extends BaseFile {}

class Window {
  manager: WindowManager;
  directory: Directory;
  element: HTMLElement;
  nameElement: HTMLElement;
  closeElement: HTMLElement;
  headerElement: HTMLElement;
  name: string;

  offsetX: number = 0;
  offsetY: number = 0;
  dragging: boolean = false;

  constructor(
    manager: WindowManager,
    windowTemplate: HTMLTemplateElement,
    directoryTemplate: HTMLTemplateElement,
    name: string,
    x: number,
    y: number,
  ) {
    this.manager = manager;
    this.element = document
      .importNode(windowTemplate, true)
      .content.querySelector(".window")!;
    this.nameElement = this.element.querySelector(".window-header-name")!;
    this.nameElement.textContent = name;
    this.closeElement = this.element.querySelector(".close")!;
    this.headerElement = this.element.querySelector(".window-header")!;
    this.name = name;
    this.directory = new Directory(directoryTemplate);
    this.moveWindow(x, y);

    this.closeElement.addEventListener("mousedown", this.onClose.bind(this));
    this.headerElement.addEventListener(
      "mousedown",
      this.onDragStart.bind(this),
    );
    this.element.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.headerElement.addEventListener("mouseup", this.onDragEnd.bind(this));
    this.element.addEventListener("mousedown", this.onClick.bind(this));
  }

  moveWindow(x: number, y: number) {
    let top = clamp(
      y + this.offsetY,
      0,
      window.innerHeight -
        Number(
          window
            .getComputedStyle(document.documentElement)
            .getPropertyValue("--window-height")
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
            .getPropertyValue("--window-width")
            .slice(0, -2),
        ),
    );
    this.element.style.top = `${top}px`;
    this.element.style.left = `${left}px`;
  }

  onClose(ev: MouseEvent) {
    console.log("close");
    ev.stopPropagation();
    this.manager.removeWindow(this.name);
  }

  onDragStart(ev: MouseEvent) {
    console.log("mousedown");
    this.element.click();
    this.offsetX = Number(this.element.style.left.slice(0, -2)) - ev.clientX;
    this.offsetY = Number(this.element.style.top.slice(0, -2)) - ev.clientY;
    this.dragging = true;
  }
  onMouseMove(ev: MouseEvent) {
    if (this.dragging) {
      this.moveWindow(ev.clientX, ev.clientY);
    }
  }
  onDragEnd(ev: MouseEvent) {
    this.dragging = false;
  }

  onClick(ev: MouseEvent) {
    console.log("click");
    this.manager.removeWindowObject(this);
    this.manager.addWindowObject(this);
  }
}

class WindowManager {
  windows: Array<Window> = [];
  element: HTMLElement;
  windowTemplate: HTMLTemplateElement;
  directoryTemplate: HTMLTemplateElement;

  constructor(
    element: HTMLElement,
    windowTemplate: HTMLTemplateElement,
    directoryTemplate: HTMLTemplateElement,
  ) {
    this.element = element;
    this.element.style.zIndex = `${Z.UI}`;
    this.windowTemplate = windowTemplate;
    this.directoryTemplate = directoryTemplate;
  }

  addWindow(name: string, x: number, y: number) {
    let window = new Window(
      this,
      this.windowTemplate,
      this.directoryTemplate,
      name,
      x,
      y,
    );
    this.addWindowObject(window);
  }

  addWindowObject(window: Window) {
    this.windows.push(window);
    this.element.appendChild(window.element);
  }

  getWindow(name: string) {
    return this.windows.find((v) => {
      return v.name == name;
    });
  }

  removeWindow(name: string) {
    let window = this.getWindow(name);
    if (!window) return;
    this.removeWindowObject(window);
  }

  removeWindowObject(window: Window) {
    this.element.removeChild(window.element);
    this.windows.splice(this.windows.indexOf(window), 1)[0];
  }

  clear() {
    this.element.innerText = "";
  }
}

class System {
  directory: Directory;
  windowManager: WindowManager;
  private systemTemplate: HTMLTemplateElement;
  private fileTemplate: HTMLTemplateElement;
  private directoryTemplate: HTMLTemplateElement;
  private windowTemplate: HTMLTemplateElement;
  element: HTMLElement;

  mouseX: number;
  mouseY: number;

  constructor(
    systemTemplate: HTMLTemplateElement,
    fileTemplate: HTMLTemplateElement,
    directoryTemplate: HTMLTemplateElement,
    windowTemplate: HTMLTemplateElement,
  ) {
    this.mouseX = 0;
    this.mouseY = 0;
    this.systemTemplate = systemTemplate;
    this.fileTemplate = fileTemplate;
    this.directoryTemplate = directoryTemplate;
    this.windowTemplate = windowTemplate;
    this.directory = new Directory(directoryTemplate);
    this.element = document
      .importNode(systemTemplate, true)
      .content.querySelector(".system")!;
    this.windowManager = new WindowManager(
      this.element.querySelector(".window-manager")!,
      windowTemplate,
      directoryTemplate,
    );
    this.element.style.zIndex = `${Z.SYSTEM}`;
    this.element.prepend(this.directory.element);

    // event listeners for system
    this.element.addEventListener("dragover", this.onDragOver);
    this.element.addEventListener("drop", this.onDrop.bind(this));
    this.element.addEventListener("mousemove", this.onMouseMove.bind(this));
  }

  addWindow(name: string, x: number, y: number) {
    this.windowManager.addWindow(name, x, y);
  }

  addFile(name: string, type: FileTypes) {
    let file: BaseFile;
    switch (type) {
      case FileTypes.TEXT:
        file = new Text(
          this,
          this.fileTemplate,
          name,
          "",
          PositionMode.ABSOLUTE,
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight,
        );
        break;

      default:
        file = new BaseFile(
          this,
          this.fileTemplate,
          name,
          PositionMode.ABSOLUTE,
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight,
        );
        break;
    }
    this.directory.addFile(file);
    // this.element.appendChild(file.element);

    return file;
  }

  removeFile(name: string) {
    let file = this.directory.removeFile(name);
    // if (!file) return;
    // this.element.removeChild(file.element);
  }

  moveFile(name: string, x: number, y: number) {
    this.directory.moveFile(name, x, y);
    // let file = this.directory.getFile(name);
    // if (!file) return;
    // file.moveFile(x, y);
    // this.directory.reorderFile(file);
    // this.element.removeChild(file.element);
    // this.element.appendChild(file.element);
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
          console.log(`system received ${data}`);
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

export { Text, Folder, Image, Drive, System, FileTypes };

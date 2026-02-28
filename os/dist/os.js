// clamp between `min` and `max`
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
var PositionMode;
(function (PositionMode) {
    PositionMode[PositionMode["INLINE"] = 0] = "INLINE";
    PositionMode[PositionMode["ABSOLUTE"] = 1] = "ABSOLUTE";
})(PositionMode || (PositionMode = {}));
var Z;
(function (Z) {
    Z[Z["SYSTEM"] = 0] = "SYSTEM";
    Z[Z["FILES"] = 1] = "FILES";
    Z[Z["UI"] = 2] = "UI";
})(Z || (Z = {}));
var FileTypes;
(function (FileTypes) {
    FileTypes[FileTypes["TEXT"] = 0] = "TEXT";
    FileTypes[FileTypes["FOLDER"] = 1] = "FOLDER";
    FileTypes[FileTypes["IMAGE"] = 2] = "IMAGE";
    FileTypes[FileTypes["DRIVE"] = 3] = "DRIVE";
})(FileTypes || (FileTypes = {}));
class BaseFile {
    constructor(system, fileTemplate, name, mode, x, y) {
        // initial
        this.offsetX = 0;
        this.offsetY = 0;
        this.beingDragged = false;
        this.system = system;
        this.element = document
            .importNode(fileTemplate, true)
            .content.querySelector(".file");
        this.nameElement = this.element.querySelector(".file-name");
        this.iconElement = this.element.querySelector(".file-icon");
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
    moveFile(x, y) {
        // console.log(`x: ${x + this.offsetX} ,y: ${y + this.offsetY}`);
        // let top = y + this.offsetY;
        // let left = x + this.offsetX;
        let top = clamp(y + this.offsetY, 0, window.innerHeight -
            Number(window
                .getComputedStyle(document.documentElement)
                .getPropertyValue("--file-height")
                .slice(0, -2)));
        let left = clamp(x + this.offsetX, 0, window.innerWidth -
            Number(window
                .getComputedStyle(document.documentElement)
                .getPropertyValue("--file-width")
                .slice(0, -2)));
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
    onDragEnd(ev) {
        this.element.classList.remove("file-no-hover");
        this.beingDragged = false;
        this.element.focus();
    }
    onDragEnter(ev) {
        this.element.classList.add("file-hover");
        if (this.beingDragged) {
            console.log("okay hover!!!!");
            this.element.classList.remove("file-no-hover");
        }
    }
    onDragLeave(ev) {
        this.element.classList.remove("file-hover");
        if (this.beingDragged) {
            console.log("no hover!!!!");
            this.element.classList.add("file-no-hover");
        }
    }
    onDragOver(ev) {
        ev.dataTransfer.dropEffect = "copy";
        ev.preventDefault();
        ev.stopPropagation();
    }
}
class Directory {
    constructor(directoryTemplate) {
        this.files = [];
        this.element = document
            .importNode(directoryTemplate, true)
            .content.querySelector(".directory");
        this.element.style.zIndex = `${Z.FILES}`;
        this.element.addEventListener("focusin", this.onFocusIn.bind(this));
    }
    addFile(file) {
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
    getFile(name) {
        return this.files.find((v) => {
            return v.name == name;
        });
    }
    reorderFile(name) {
        let file = this.getFile(name);
        if (!file)
            return;
        if (Array.from(this.element.children).slice(-1)[0] == file.element) {
            return;
        }
        this.element.removeChild(file.element);
        this.element.appendChild(file.element);
        file.element.focus();
    }
    reorderFileObj(file) {
        this.element.removeChild(file.element);
        this.element.appendChild(file.element);
    }
    moveFile(name, x, y) {
        let file = this.getFile(name);
        if (!file)
            return;
        file.moveFile(x, y);
        this.reorderFileObj(file);
    }
    removeFile(name) {
        let file = this.getFile(name);
        if (!file)
            return;
        this.element.removeChild(file.element);
        return this.files.splice(this.files.indexOf(file))[0];
    }
    clear() {
        this.element.innerText = "";
    }
    onFocusIn(ev) {
        this.reorderFile(ev.target.querySelector(".file-name").textContent);
    }
}
class Text extends BaseFile {
    constructor(system, fileTemplate, name, content, mode, x, y) {
        super(system, fileTemplate, name, mode, x, y);
        this.content = content;
        this.element.addEventListener("dragstart", this.onDragStart.bind(this));
        this.element.addEventListener("drop", this.onDrop.bind(this));
    }
    changeContent(newContent) {
        this.content = newContent;
    }
    onDragStart(ev) {
        this.element.blur();
        this.offsetX = Number(this.element.style.left.slice(0, -2)) - ev.clientX;
        this.offsetY = Number(this.element.style.top.slice(0, -2)) - ev.clientY;
        let fileData = { name: this.name, type: FileTypes.TEXT };
        ev.dataTransfer.items.add(JSON.stringify(fileData), "text/plain");
        this.beingDragged = true;
    }
    onDrop(ev) {
        ev.stopPropagation();
        this.element.classList.remove("file-no-hover");
        this.element.classList.remove("file-hover");
        if (!ev.dataTransfer)
            return;
        if (this.beingDragged)
            return;
        for (let i = 0; i < ev.dataTransfer.items.length; i++) {
            let item = ev.dataTransfer.items[i];
            if (item.kind === "string") {
                item.getAsString((data) => {
                    // let newData: FileJSONData = JSON.parse(data);
                    // newData.from = this.name;
                    // let dataString = JSON.stringify(newData);
                    // ev.dataTransfer!.items.clear();
                    // ev.dataTransfer!.items.add(dataString, "text/plain");
                    console.log(`${this.name} received ${data}`);
                    let fileData = JSON.parse(data);
                    let file = this.system.directory.getFile(fileData.name);
                    this.system.addWindow(file.name, (Math.random() * window.innerWidth) / 2, (Math.random() * window.innerHeight) / 2);
                });
            }
        }
        this.element.focus();
    }
}
class Folder extends BaseFile {
}
class Image extends BaseFile {
}
class Drive extends BaseFile {
}
class Window {
    constructor(manager, windowTemplate, directoryTemplate, name, x, y) {
        this.offsetX = 0;
        this.offsetY = 0;
        this.dragging = false;
        this.manager = manager;
        this.element = document
            .importNode(windowTemplate, true)
            .content.querySelector(".window");
        this.nameElement = this.element.querySelector(".window-header-name");
        this.nameElement.textContent = name;
        this.closeElement = this.element.querySelector(".close");
        this.headerElement = this.element.querySelector(".window-header");
        this.name = name;
        this.directory = new Directory(directoryTemplate);
        this.moveWindow(x, y);
        this.closeElement.addEventListener("mousedown", this.onClose.bind(this));
        this.headerElement.addEventListener("mousedown", this.onDragStart.bind(this));
        this.element.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.headerElement.addEventListener("mouseup", this.onDragEnd.bind(this));
        this.element.addEventListener("mousedown", this.onClick.bind(this));
    }
    moveWindow(x, y) {
        let top = clamp(y + this.offsetY, 0, window.innerHeight -
            Number(window
                .getComputedStyle(document.documentElement)
                .getPropertyValue("--window-height")
                .slice(0, -2)));
        let left = clamp(x + this.offsetX, 0, window.innerWidth -
            Number(window
                .getComputedStyle(document.documentElement)
                .getPropertyValue("--window-width")
                .slice(0, -2)));
        this.element.style.top = `${top}px`;
        this.element.style.left = `${left}px`;
    }
    onClose(ev) {
        console.log("close");
        ev.stopPropagation();
        this.manager.removeWindow(this.name);
    }
    onDragStart(ev) {
        console.log("mousedown");
        this.element.click();
        this.offsetX = Number(this.element.style.left.slice(0, -2)) - ev.clientX;
        this.offsetY = Number(this.element.style.top.slice(0, -2)) - ev.clientY;
        this.dragging = true;
    }
    onMouseMove(ev) {
        if (this.dragging) {
            this.moveWindow(ev.clientX, ev.clientY);
        }
    }
    onDragEnd(ev) {
        this.dragging = false;
    }
    onClick(ev) {
        console.log("click");
        this.manager.removeWindowObject(this);
        this.manager.addWindowObject(this);
    }
}
class WindowManager {
    constructor(element, windowTemplate, directoryTemplate) {
        this.windows = [];
        this.element = element;
        this.element.style.zIndex = `${Z.UI}`;
        this.windowTemplate = windowTemplate;
        this.directoryTemplate = directoryTemplate;
    }
    addWindow(name, x, y) {
        let window = new Window(this, this.windowTemplate, this.directoryTemplate, name, x, y);
        this.addWindowObject(window);
    }
    addWindowObject(window) {
        this.windows.push(window);
        this.element.appendChild(window.element);
    }
    getWindow(name) {
        return this.windows.find((v) => {
            return v.name == name;
        });
    }
    removeWindow(name) {
        let window = this.getWindow(name);
        if (!window)
            return;
        this.removeWindowObject(window);
    }
    removeWindowObject(window) {
        this.element.removeChild(window.element);
        this.windows.splice(this.windows.indexOf(window), 1)[0];
    }
    clear() {
        this.element.innerText = "";
    }
}
class System {
    constructor(systemTemplate, fileTemplate, directoryTemplate, windowTemplate) {
        this.mouseX = 0;
        this.mouseY = 0;
        this.systemTemplate = systemTemplate;
        this.fileTemplate = fileTemplate;
        this.directoryTemplate = directoryTemplate;
        this.windowTemplate = windowTemplate;
        this.directory = new Directory(directoryTemplate);
        this.element = document
            .importNode(systemTemplate, true)
            .content.querySelector(".system");
        this.windowManager = new WindowManager(this.element.querySelector(".window-manager"), windowTemplate, directoryTemplate);
        this.element.style.zIndex = `${Z.SYSTEM}`;
        this.element.prepend(this.directory.element);
        // event listeners for system
        this.element.addEventListener("dragover", this.onDragOver);
        this.element.addEventListener("drop", this.onDrop.bind(this));
        this.element.addEventListener("mousemove", this.onMouseMove.bind(this));
    }
    addWindow(name, x, y) {
        this.windowManager.addWindow(name, x, y);
    }
    addFile(name, type) {
        let file;
        switch (type) {
            case FileTypes.TEXT:
                file = new Text(this, this.fileTemplate, name, "", PositionMode.ABSOLUTE, Math.random() * window.innerWidth, Math.random() * window.innerHeight);
                break;
            default:
                file = new BaseFile(this, this.fileTemplate, name, PositionMode.ABSOLUTE, Math.random() * window.innerWidth, Math.random() * window.innerHeight);
                break;
        }
        this.directory.addFile(file);
        // this.element.appendChild(file.element);
        return file;
    }
    removeFile(name) {
        let file = this.directory.removeFile(name);
        // if (!file) return;
        // this.element.removeChild(file.element);
    }
    moveFile(name, x, y) {
        this.directory.moveFile(name, x, y);
        // let file = this.directory.getFile(name);
        // if (!file) return;
        // file.moveFile(x, y);
        // this.directory.reorderFile(file);
        // this.element.removeChild(file.element);
        // this.element.appendChild(file.element);
    }
    appendSystem(element) {
        element.appendChild(this.element);
    }
    onDragOver(ev) {
        ev.dataTransfer.dropEffect = "move";
        ev.preventDefault();
    }
    onDrop(ev) {
        if (!ev.dataTransfer)
            return;
        for (let i = 0; i < ev.dataTransfer.items.length; i++) {
            let item = ev.dataTransfer.items[i];
            if (item.kind === "string") {
                item.getAsString((data) => {
                    console.log(`system received ${data}`);
                    let fileData = JSON.parse(data);
                    this.moveFile(fileData.name, ev.clientX, ev.clientY);
                });
            }
        }
    }
    onMouseMove(ev) {
        // console.log(`mousemove: ${ev.clientX}, ${ev.clientY}`);
        this.mouseX = ev.clientX;
        this.mouseY = ev.clientY;
    }
}
export { Text, Folder, Image, Drive, System, FileTypes };
//# sourceMappingURL=os.js.map
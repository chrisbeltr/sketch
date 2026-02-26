var ZIndexes;
(function (ZIndexes) {
    ZIndexes[ZIndexes["SYSTEM"] = 0] = "SYSTEM";
    ZIndexes[ZIndexes["BLUR"] = 1] = "BLUR";
    ZIndexes[ZIndexes["FOCUS"] = 2] = "FOCUS";
    ZIndexes[ZIndexes["UI"] = 3] = "UI";
})(ZIndexes || (ZIndexes = {}));
var PositionMode;
(function (PositionMode) {
    PositionMode[PositionMode["INLINE"] = 0] = "INLINE";
    PositionMode[PositionMode["ABSOLUTE"] = 1] = "ABSOLUTE";
})(PositionMode || (PositionMode = {}));
class BaseFile {
    constructor(fileTemplate, name, mode, x, y) {
        // initial
        this.offsetX = 0;
        this.offsetY = 0;
        this.beingDragged = false;
        this.element = document
            .importNode(fileTemplate, true)
            .content.querySelector(".file");
        this.element.style.zIndex = `${ZIndexes.BLUR}`;
        this.nameElement = this.element.querySelector(".file-name");
        this.name = name;
        this.nameElement.textContent = name;
        if (mode == PositionMode.ABSOLUTE) {
            this.element.style.position = "absolute";
            this.element.style.top = `${y}px`;
            this.element.style.left = `${x}px`;
        }
        // adding handlers
        this.element.addEventListener("focus", this.onFocus.bind(this));
        this.element.addEventListener("blur", this.onBlur.bind(this));
        this.element.addEventListener("dragstart", this.onDragStart.bind(this));
        this.element.addEventListener("dragend", this.onDragEnd.bind(this));
        this.element.addEventListener("dragover", this.onDragOver);
        this.element.addEventListener("dragenter", this.onDragEnter.bind(this));
        this.element.addEventListener("dragleave", this.onDragLeave.bind(this));
        this.element.addEventListener("drop", this.onDrop.bind(this));
    }
    moveFile(x, y) {
        // console.log(`x: ${x + this.offsetX} ,y: ${y + this.offsetY}`);
        this.element.style.top = `${y + this.offsetY}px`;
        this.element.style.left = `${x + this.offsetX}px`;
    }
    onFocus(ev) {
        this.element.style.zIndex = `${ZIndexes.FOCUS}`;
    }
    onBlur(ev) {
        this.element.style.zIndex = `${ZIndexes.BLUR}`;
    }
    onDragStart(ev) {
        this.element.blur();
        let currTop = this.element.style.top;
        let currLeft = this.element.style.left;
        this.offsetX =
            Number(currLeft.substring(0, currLeft.length - 2)) - ev.clientX;
        this.offsetY =
            Number(currTop.substring(0, currTop.length - 2)) - ev.clientY;
        ev.dataTransfer.items.add(`{"name": "${this.name}"}`, "text/plain");
        // console.log(`x: ${this.offsetX}, y: ${this.offsetY}`);
        this.beingDragged = true;
    }
    onDragEnd(ev) {
        this.element.classList.remove("file-no-hover");
        this.beingDragged = false;
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
    onDrop(ev) {
        ev.stopPropagation();
        this.element.classList.remove("file-no-hover");
        this.element.classList.remove("file-hover");
        if (!ev.dataTransfer)
            return;
        for (let i = 0; i < ev.dataTransfer.items.length; i++) {
            let item = ev.dataTransfer.items[i];
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
    constructor() {
        this.files = [];
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
        this.files.push(file);
    }
    getFile(name) {
        return this.files.find((v) => {
            return v.name == name;
        });
    }
    removeFile(name) {
        let file = this.getFile(name);
        if (!file)
            return;
        return this.files.splice(this.files.indexOf(file))[0];
    }
}
class Text extends BaseFile {
    constructor(fileTemplate, name, content, mode, x, y) {
        super(fileTemplate, name, mode, x, y);
        this.content = content;
    }
    changeContent(newContent) {
        this.content = newContent;
    }
}
class Folder extends BaseFile {
}
class Image extends BaseFile {
}
class Drive extends BaseFile {
}
class System {
    constructor(systemTemplate, fileTemplate) {
        this.mouseX = 0;
        this.mouseY = 0;
        this.systemTemplate = systemTemplate;
        this.fileTemplate = fileTemplate;
        this.directory = new Directory();
        this.element = document
            .importNode(systemTemplate, true)
            .content.querySelector(".system");
        this.element.style.zIndex = `${ZIndexes.SYSTEM}`;
        // event listeners for system
        this.element.addEventListener("dragover", this.onDragOver);
        this.element.addEventListener("drop", this.onDrop.bind(this));
        this.element.addEventListener("mousemove", this.onMouseMove.bind(this));
    }
    addFile(name) {
        let file = new BaseFile(this.fileTemplate, name, PositionMode.ABSOLUTE, 0, 0);
        this.directory.addFile(file);
        this.element.appendChild(file.element);
        return file;
    }
    removeFile(name) {
        let file = this.directory.removeFile(name);
        if (!file)
            return;
        this.element.removeChild(file.element);
    }
    moveFile(name, x, y) {
        let file = this.directory.getFile(name);
        if (!file)
            return;
        file.moveFile(x, y);
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
export { Text, Folder, Image, Drive, System };
//# sourceMappingURL=os.js.map
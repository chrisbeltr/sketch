import { System } from "./os.js";
const sysTemplate = document.getElementById("system-template");
const fileTemplate = document.getElementById("file-template");
const directoryTemplate = document.getElementById("directory-template");
const windowTemplate = document.getElementById("window-template");
let sys = new System(sysTemplate, fileTemplate, directoryTemplate, windowTemplate);
sys.addFile("this is");
sys.addFile("not a");
sys.addFile("test");
sys.addFile("test");
sys.appendSystem(document.body);
//# sourceMappingURL=index.js.map
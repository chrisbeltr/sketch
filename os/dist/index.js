import { System, FileTypes, Text, Folder } from "./os.js";
const sysTemplate = document.getElementById("system-template");
const fileTemplate = document.getElementById("file-template");
const directoryTemplate = document.getElementById("directory-template");
const windowTemplate = document.getElementById("window-template");
let sys = new System(sysTemplate, fileTemplate, directoryTemplate, windowTemplate);
let thisis = sys.addFile("this is", FileTypes.TEXT);
sys.appendSystem(document.body);
thisis.content = "now this is what i call a text file";
let nota = sys.addFile("not a", FileTypes.FOLDER);
let hiii = nota.addFile("hiii", FileTypes.TEXT);
hiii.content = "uwu";
let test = sys.addFile("test", FileTypes.TEXT);
test.content = "now this is what i call a test file";
let test1 = sys.addFile("test", FileTypes.TEXT);
test1.content = "now this is what i call a test1";
//# sourceMappingURL=index.js.map
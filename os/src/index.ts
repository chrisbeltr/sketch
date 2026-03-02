import { System, FileTypes, Text, Folder } from "./os.js";

const sysTemplate = document.getElementById(
  "system-template",
) as HTMLTemplateElement;
const fileTemplate = document.getElementById(
  "file-template",
) as HTMLTemplateElement;
const directoryTemplate = document.getElementById(
  "directory-template",
) as HTMLTemplateElement;
const windowTemplate = document.getElementById(
  "window-template",
) as HTMLTemplateElement;

let sys = new System(
  sysTemplate,
  fileTemplate,
  directoryTemplate,
  windowTemplate,
);
let thisis = sys.addFile("this is", FileTypes.TEXT) as Text;
sys.appendSystem(document.body);
thisis.content = "now this is what i call a text file";
let nota = sys.addFile("not a", FileTypes.FOLDER) as Folder;
let hiii = nota.addFile("hiii", FileTypes.TEXT) as Text;
hiii.content = "uwu";
let test = sys.addFile("test", FileTypes.TEXT) as Text;
test.content = "now this is what i call a test file";
let test1 = sys.addFile("test", FileTypes.TEXT) as Text;
test1.content = "now this is what i call a test1";

import { System } from "./os.js";

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
sys.addFile("this is");
sys.addFile("not a");
sys.addFile("test");
sys.addFile("test");
sys.appendSystem(document.body);

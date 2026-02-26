import * as os from "./os.js";

const sysTemplate = document.getElementById(
  "system-template",
) as HTMLTemplateElement;
const fileTemplate = document.getElementById(
  "file-template",
) as HTMLTemplateElement;

let sys = new os.System(sysTemplate, fileTemplate);
sys.addFile("this is");
sys.addFile("not a");
sys.addFile("test");
sys.addFile("test");
sys.appendSystem(document.body);
import * as os from "./os.js";
const sysTemplate = document.getElementById("system-template");
const fileTemplate = document.getElementById("file-template");
let sys = new os.System(sysTemplate, fileTemplate);
sys.addFile("badman.txt");
sys.addFile("heyy");
sys.appendSystem(document.body);
//# sourceMappingURL=index.js.map
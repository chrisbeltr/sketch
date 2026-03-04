import { System, FileTypes, Text, Folder } from "./os.js";
const sysTemplate = document.getElementById("system-template");
const fileTemplate = document.getElementById("file-template");
const directoryTemplate = document.getElementById("directory-template");
const windowTemplate = document.getElementById("window-template");
let sys = new System(sysTemplate, fileTemplate, directoryTemplate, windowTemplate);
const iHeight = 454;
const iWidth = 798;
const zoom = 0.75;
const scaledHeight = iHeight / zoom;
const scaledWidth = iWidth / zoom;
let readme = sys.addFile("README.md", FileTypes.TEXT);
readme.content = `hi there! welcome to my little web operating system! it works a little differently to what you might be used to from your own operating system, so let me give you some guidance :3<br><br>there are a few different file types here:<br><ul><li>text files are blue</li><li>folders are purple</li><li>your user file is golden</li></ul>you can think of the golden user file as a representation of you, the user! that does not mean you can move it around with WASD like a video game character, but your actions in this operating system will revolve around this user file, so keep that mind!<br><br>here's how you interact with the operating system:<br><ul><li>drag files around to move them!</li><li>drag files on top of user.lnk to open them!</li><li>drag windows around to move them and close them with the close button!</li><li>you cannot drag files into or out of folders :(</li><li>please don't drag windows too quickly or they might stop being dragged, sorry!</li></ul><br>have fun and enjoy! this took a long time to make ;-;`;
cookieStore.get("readme").then((cookie) => {
    if (!cookie) {
        let readmeWindow = sys.addWindow("README.md", 100, 100);
        readmeWindow.bodyElement.innerHTML = readme.content;
        cookieStore.set("readme", "read");
    }
});
let reflection = sys.addFile("reflection.txt", FileTypes.TEXT);
reflection.content = `<ul><li>i could've made this prettier i think, i just ran out of time and didn't think about the actual design very much</li><li>i need to fix the dragging somehow</li><li>this code is NOT clean at ALL there's tons of weird system design choices i made</li><li>i only implemented two of the filetypes i wanted to, i had planned to make image files and "drives" which would take you to other "desktops"</li><li>in order to push things to the top, i remove them from the DOM and add them back in, which is not the most elegant of solutions. this is quite noticeable if you drag a window that has an iframe in it, as it will refresh the page inside the iframe every time you start dragging it</li></ul>`;
let homework = sys.addFile("homework", FileTypes.FOLDER);
let phase1 = homework.addFile("phase1.html", FileTypes.TEXT);
phase1.content = `<iframe style="position: absolute; top: 0; left: 0; zoom: ${zoom};" height="${scaledHeight}" width="${scaledWidth}" loading="lazy" title="phase1" src="https://sketch.borks.dev/phase1?ex=true"></iframe>`;
let phase2 = homework.addFile("phase2.html", FileTypes.TEXT);
phase2.content = `<iframe style="position: absolute; top: 0; left: 0; zoom: ${zoom};" height="${scaledHeight}" width="${scaledWidth}" loading="lazy" title="phase2" src="https://sketch.borks.dev/phase2?ex=true"></iframe>`;
let poster = homework.addFile("poster.html", FileTypes.TEXT);
poster.content = `<iframe style="position: absolute; top: 0; left: 0; zoom: ${zoom};" height="${scaledHeight}" width="${scaledWidth}" loading="lazy" title="poster" src="https://sketch.borks.dev/poster?ex=true"></iframe>`;
let still = homework.addFile("still.html", FileTypes.TEXT);
still.content = `<iframe style="position: absolute; top: 0; left: 0; zoom: ${zoom};" height="${scaledHeight}" width="${scaledWidth}" loading="lazy" title="still" src="https://sketch.borks.dev/still?ex=true"></iframe>`;
let recurse = homework.addFile("os.ts", FileTypes.TEXT);
recurse.content = `<iframe style="position: absolute; top: 0; left: 0; zoom: ${zoom};" height="${scaledHeight}" width="${scaledWidth}" loading="lazy" title="recursing..." src="https://sketch.borks.dev/os?ex=true"></iframe>`;
let homepage = sys.addFile("homepage.html", FileTypes.TEXT);
homepage.content = `<iframe style="position: absolute; top: 0; left: 0; zoom: ${zoom};" height="${scaledHeight}" width="${scaledWidth}" loading="lazy" title="recursing..." src="https://borks.dev/"></iframe>`;
let convo1 = sys.addFile("this", FileTypes.FOLDER);
let convo2 = convo1.addFile("is", FileTypes.FOLDER);
let convo3 = convo2.addFile("the", FileTypes.FOLDER);
let convo4 = convo3.addFile("start", FileTypes.FOLDER);
let convo5 = convo4.addFile("of", FileTypes.FOLDER);
let convo6 = convo5.addFile("a", FileTypes.FOLDER);
let convo7 = convo6.addFile("kinda", FileTypes.FOLDER);
let convo8 = convo7.addFile("lengthy", FileTypes.FOLDER);
let convo9 = convo8.addFile("conversation.txt", FileTypes.TEXT);
convo9.content = "and this is the end of it!";
sys.appendSystem(document.body);
//# sourceMappingURL=index.js.map
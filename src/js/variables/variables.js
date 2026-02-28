// Global Variables


const LOADING_TIME = rand(1000, 3500); // Milliseconds
const SETTINGS_TIMEOUT = 10; // Since settings elements are dynamically injected, this is to wait until the elements are FULLY there to prevent errors.
const arrowLeftHook = "←", arrowUpHook = "↑", arrowRightHook = "→", arrowDownHook = "↓";

const DEFAULT_COLOR = "var(--header-primary)";
const HOLOGRAPHIC_COLOR1 = "#a9c9ff";
const HOLOGRAPHIC_COLOR2 = "#ffbbec";
const HOLOGRAPHIC_COLOR3 = "#ffc3a0";

// Strings
const defaultEmojiDesc = "A default emoji. You can use this emoji everywhere on SparkleCord.";

// Version Info
const versionCode = "1.4.4", versionState = "stable", versionType = "Client", versionName = "";
const versionHTML = `SparkleCord ${versionType} Version ${versionCode} <br>(${versionState}) ${versionName ? `- ${versionName}` : ``}`;

// Functoins
const debugLogsEnabled = false;
function debugLog(content) {
    if (debugLogsEnabled) console.log("%c[DEBUG]", "color:rgb(175, 64, 202);", content);
    else return;
}

if (location.protocol.startsWith("http")) {
    document.head.appendChild(el("link", { rel: "manifest", href: "./assets/PWA/manifest.json" }));
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        setTimeout(e.prompt(), 3000);
    });
} else {
   // console.log("%c[WARNING]", "color: orange; font-weight: bold;", "To use the PWA (Progressive Web App) version of SparkleCord, You need to host it on a http/https server. Then click the install button.");
}

// debugLog(`SparkleCord is located in: ${rootPath}index.html`);

function initConsoleMessages() {
    // Custom Line 1
    console.log("%cHold Up!", 
        "color: #5865f2; -webkit-text-stroke: 2px black; font-size: 72px; font-weight: bold; font-family: 'Consolas';");
    // Custom Line 2
    console.log("%cThere is no hidden online mode, SparkleCord Server is currently not planned for release, but this could change soon.", 
        "font-size: 16px; font-family: 'Consolas';");
    // Custom Line 3
    console.log("%cPro Tip: You can change to most (non-gradient) themes by doing 'setTheme()'. For example: setTheme('light'), You currently cannot force on/off of visual refresh or client theme.",
        "color: red; font-size: 18px; font-weight: bold; font-family: 'Consolas';");
    // Custom Line 4
    console.log("%cMake sure to never run scripts from untrusted sources! If where you got the script looks sketchy, don't run it.", 
        "font-size: 16px; font-family: 'Consolas';");
    // Custom Line 5
    console.log("%cIf you have any internal questions about SparkleCord, just DM me on Discord (username is doctoon).", 
        "font-size: 16px; font-family: 'Consolas';");
    // Other insta-logs go here.
}
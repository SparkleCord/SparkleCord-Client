// Utility Functions
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const snflk = d => ((BigInt(d) - 1420070400000n) << 22n) | BigInt(rand(0, 0xFFFFFFFF));
const speak = t => speechSynthesis.speaking || speechSynthesis.speak(new SpeechSynthesisUtterance(t));
const $ = id => document.getElementById(id);

function generateUsername() {
    const adjectives = [
        "adaptable", "adventurous", "affectionate", "agreeable", "ambitious", "amiable", "amusing",
        "brave", "bright", "calm", "charming", "cheerful", "clever", "compassionate", "confident",
        "considerate", "courageous", "courteous", "creative", "decisive", "determined", "diligent",
        "diplomatic", "dynamic", "easygoing", "empathetic", "energetic", "enthusiastic", "faithful",
        "fearless", "friendly", "funny", "generous", "gentle", "happy", "helpful", "honest",
        "humble", "imaginative", "independent", "industrious", "ingenious", "intelligent", "inventive",
        "joyful", "kind", "lively", "loving", "loyal", "modest", "motivated", "neat", "optimistic",
        "passionate", "patient", "persistent", "playful", "polite", "practical", "quick", "quiet",
        "reliable", "resourceful", "sensible", "sincere", "sociable", "strong", "sympathetic",
        "thoughtful", "trustworthy", "understanding", "upbeat", "versatile", "warm", "witty"
    ];
    const nouns = [
        "cactus", "penguin", "potato", "rocket", "tiger", "moon", "apple", "backpack", "bicycle",
        "candle", "dolphin", "eclipse", "feather", "giraffe", "hamburger", "island", "jigsaw",
        "kangaroo", "lantern", "marshmallow", "notebook", "octopus", "puzzle", "quokka", "rainbow",
        "sandcastle", "telescope", "umbrella", "volcano", "waterfall", "xylophone", "yacht", "zeppelin",
        "avocado", "butterfly", "cloud", "dragonfly", "elephant", "firefly", "glacier", "hedgehog",
        "iguana", "jellyfish", "koala", "ladybug", "mushroom", "narwhal", "otter", "pancake",
        "quartz", "rhinoceros", "snowflake", "tornado", "ukulele", "violet", "whale", "yeti", "zebra"
    ];  
    const word1 = adjectives[Math.random() * adjectives.length | 0], word2 = nouns[Math.random() * nouns.length | 0];
    return `${word1}_${word2}_${(Math.random() * 100000 | 0).toString().padStart(5, '0')}`;
}

// Profile Setup
let profile = JSON.parse(localStorage.getItem("profile")) || {};
if (!profile.username) profile.username = generateUsername(true);
if (!profile.name) profile.name = profile.username;
if (!profile.avatar) profile.avatar = `./assets/avatars/${rand(0, 18)}.png`;
if (!profile.defaultAvatar) profile.defaultAvatar = profile.avatar;
if (!profile.status) profile.status = "Online";
if (!profile.id) profile.id = snflk(Date.now()).toString();
localStorage.setItem("profile", JSON.stringify(profile));
profile.id = BigInt(profile.id);

// System users list
let systemUsers = {
    core: {
        name: "Clyde",
        username: "clyde",
        avatar: "./assets/avatars/core/Clyde.gif",
        id: 1n,
        tag: { name: "Bot", verified: false, bg: "var(--bg-brand)" },
        groupID: `core`,
    },
    error: {
        name: "Clyde",
        username: "clyde",
        avatar: "./assets/avatars/core/Clyde-Old.png",
        id: 2n,
        tag: { name: "Error", verified: false, bg: "var(--red-500)" },
        groupID: `error`,
    },
    ai: {
        name: "Sparkly",
        username: `sparkly`,
        avatar: "./assets/avatars/core/sparkly.png",
        id: 2n,
        tag: { name: "AI", verified: false, bg: "var(--green-360)" },
        groupID: `ai`,
    }
};
let sysGroups = { core: null, error: null, ai: null };

// Global Variables
let messageGroups = [], lastMessageTimestamp = null, currentMessageGroup = null, history = [""], historyIndex = 0;
let lastMessage = null, lastMessageAuthor = null, lastMessageAvatar = null, sendButton = null;
let currentAttachments = [];

const LOADING_TIME = rand(3000, 6500); // Milliseconds
const SETTINGS_TIMEOUT = 10; // Since settings elements are dynamically injected, this is to wait until the elements are FULLY there to prevent errors.
const arrowLeftHook = "←", arrowUpHook = "↑", arrowRightHook = "→", arrowDownHook = "↓";

// Strings
const defaultEmojiDesc = "A default emoji. You can use this emoji everywhere on SparkleCord.";
const blockMessage = `This can't be posted because it contains content blocked by SparkleCord.`;
const userBlockMessage = `This can't be posted because it contains content you chose to block.`;

// UI Elements
const verified = `<svg class="verified" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="var(--white-2)" fill-rule="evenodd" d="M19.06 6.94a1.5 1.5 0 0 1 0 2.12l-8 8a1.5 1.5 0 0 1-2.12 0l-4-4a1.5 1.5 0 0 1 2.12-2.12L10 13.88l6.94-6.94a1.5 1.5 0 0 1 2.12 0Z" clip-rule="evenodd"></path></svg>`

const eyecon = `<svg class="eyecon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M15.56 11.77c.2-.1.44.02.44.23a4 4 0 1 1-4-4c.21 0 .33.25.23.44a2.5 2.5 0 0 0 3.32 3.32Z"></path><path fill="currentColor" fill-rule="evenodd" d="M22.89 11.7c.07.2.07.4 0 .6C22.27 13.9 19.1 21 12 21c-7.11 0-10.27-7.11-10.89-8.7a.83.83 0 0 1 0-.6C1.73 10.1 4.9 3 12 3c7.11 0 10.27 7.11 10.89 8.7Zm-4.5-3.62A15.11 15.11 0 0 1 20.85 12c-.38.88-1.18 2.47-2.46 3.92C16.87 17.62 14.8 19 12 19c-2.8 0-4.87-1.38-6.39-3.08A15.11 15.11 0 0 1 3.15 12c.38-.88 1.18-2.47 2.46-3.92C7.13 6.38 9.2 5 12 5c2.8 0 4.87 1.38 6.39 3.08Z" clip-rule="evenodd"></path></svg>`;
const eph = `<div class="ephemeral">${eyecon}Only you can see this • <a class="link dismiss" role="button" style="cursor: pointer;">Dismiss message</a></div>`;

const err = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="transparent"></circle><path fill="currentColor" fill-rule="evenodd" d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22Zm1.44-15.94L13.06 14a1.06 1.06 0 0 1-2.12 0l-.38-6.94a1 1 0 0 1 1-1.06h.88a1 1 0 0 1 1 1.06Zm-.19 10.69a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z" clip-rule="evenodd"></path></svg>`;
const errFooter = `<span class="error" style="color: var(--text-danger);">${err}An error occurred while sending this message:</span>`;

const shield = `<svg class="shield" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M4.27 5.22A2.66 2.66 0 0 0 3 7.5v2.3c0 5.6 3.3 10.68 8.42 12.95.37.17.79.17 1.16 0A14.18 14.18 0 0 0 21 9.78V7.5c0-.93-.48-1.78-1.27-2.27l-6.17-3.76a3 3 0 0 0-3.12 0L4.27 5.22ZM6 7.68l6-3.66V12H6.22C6.08 11.28 6 10.54 6 9.78v-2.1Zm6 12.01V12h5.78A11.19 11.19 0 0 1 12 19.7Z" clip-rule="evenodd" class=""></path></svg>`;
const automodFooter = `<div class="shieldTextAutomod"><div class="shieldContainer">${shield}</div><div class="automodTextContainer"><div class="automodText" style="color: var(--interactive-normal);">${blockMessage}</div></div></div>`;
const selfAutomodFooter = `<div class="shieldTextAutomod"><div class="shieldContainer">${shield}</div><div class="automodTextContainer"><div class="automodText" style="color: var(--interactive-normal);">${userBlockMessage}</div></div></div>`;

const attachmentSVG = `<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M2 5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5Zm13.35 8.13 3.5 4.67c.37.5.02 1.2-.6 1.2H5.81a.75.75 0 0 1-.59-1.22l1.86-2.32a1.5 1.5 0 0 1 2.34 0l.5.64 2.23-2.97a2 2 0 0 1 3.2 0ZM10.2 5.98c.23-.91-.88-1.55-1.55-.9a.93.93 0 0 1-1.3 0c-.67-.65-1.78-.01-1.55.9a.93.93 0 0 1-.65 1.12c-.9.26-.9 1.54 0 1.8.48.14.77.63.65 1.12-.23.91.88 1.55 1.55.9a.93.93 0 0 1 1.3 0c.67.65 1.78.01 1.55-.9a.93.93 0 0 1 .65-1.12c.9-.26.9-1.54 0-1.8a.93.93 0 0 1-.65-1.12Z" clip-rule="evenodd" class=""></path></svg>`;
const replySVG = `<div class="replyPFP"><svg width="12" height="8" viewBox="0 0 12 8"><path d="M0.809739 3.59646L5.12565 0.468433C5.17446 0.431163 5.23323 0.408043 5.2951 0.401763C5.35698 0.395482 5.41943 0.406298 5.4752 0.432954C5.53096 0.45961 5.57776 0.50101 5.61013 0.552343C5.64251 0.603676 5.65914 0.662833 5.6581 0.722939V2.3707C10.3624 2.3707 11.2539 5.52482 11.3991 7.21174C11.4028 7.27916 11.3848 7.34603 11.3474 7.40312C11.3101 7.46021 11.2554 7.50471 11.1908 7.53049C11.1262 7.55626 11.0549 7.56204 10.9868 7.54703C10.9187 7.53201 10.857 7.49695 10.8104 7.44666C8.72224 5.08977 5.6581 5.63359 5.6581 5.63359V7.28135C5.65831 7.34051 5.64141 7.39856 5.60931 7.44894C5.5772 7.49932 5.53117 7.54004 5.4764 7.5665C5.42163 7.59296 5.3603 7.60411 5.29932 7.59869C5.23834 7.59328 5.18014 7.57151 5.13128 7.53585L0.809739 4.40892C0.744492 4.3616 0.691538 4.30026 0.655067 4.22975C0.618596 4.15925 0.599609 4.08151 0.599609 4.00269C0.599609 3.92386 0.618596 3.84612 0.655067 3.77562C0.691538 3.70511 0.744492 3.64377 0.809739 3.59646Z" fill="currentColor"></path></svg></div>`;

// Mentions
const mentionNames = ["everyone", "here", profile.username, profile.name, profile.id];
const mentionPattern = new RegExp(`@(${mentionNames.join("|")})\\b`, "gi");

// Replies
let R_TOGGLE, R_INDICATOR, messageInput;
function toggleReplyPing(forcedState = "") {
    let toggleText = R_TOGGLE.textContent;
    if (toggleText === "@ON" || forcedState === "off") {
        messageInput.setAttribute("data-pstate", false);
        R_TOGGLE.style.color = "var(--text-muted)";
        R_TOGGLE.textContent = "@OFF";
    } else if (toggleText === "@OFF" || forcedState === "om") {
        messageInput.setAttribute("data-pstate", true);
        R_TOGGLE.style.color = "var(--text-link)";
        R_TOGGLE.textContent = "@ON";
    }
}
document.addEventListener("DOMContentLoaded", () => {

    R_TOGGLE = $("ping-toggle"); R_INDICATOR = $("reply-indicator"); messageInput = $("input-box");

    R_TOGGLE.addEventListener("click", function() {
        toggleReplyPing();
    });
})

// Version Info
const versionCode = "1.2.0", versionState = "stable", versionType = "Client", versionName = "Customizalot";
const versionHTML = `SparkleCord ${versionType} Version ${versionCode} <br>(${versionState}) - ${versionName}`;

// Loading and Initialization
const rootPath = (() => {
    const path = window.location.href;
    if (window.location.protocol === 'file:') { return path.substring(0, path.lastIndexOf('/') + 1); }
    return window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
})();
console.log('SparkleCord is currently running on', rootPath)
const LOADING_LINES = [
    /* All lines were written by doctoon unless stated otherwise */
    // SparkleCord OLD lines
    { text: "Self-Love has never been easier!", weight: 1 },
    { text: "You can customize your profile!", weight: 1 },
    { text: "SparkleCord keeps you connected.... with yourself...", weight: 1 },
    { text: "Enjoy chatting with ~~friends~~ yourself!", weight: 1 },
    // Modified Discord lines
    // if u want the original lines, check out https://gist.github.com/fourjr/f94fc112cef6da07fc274216d5755420
    { text: "SparkleCord was almost called SparkAccord when I was looking for better names. Not too proud of that one.", weight: 1 },
    { text: 'There are a bunch of hidden "Easter Eggs" in the app that happen when you click certain things...', weight: 1 },
    { text: "SparkleCord started off as just a silly project that barely looked or acted like Discord.", weight: 1 },
    { text: "SparkleCord's official birthday is February 29th, 2024.", weight: 1 },
    // Keybinds
    { text: "[[SHIFT]] + [[ENTER]] to make a new line without sending your message.", weight: 1 },
    { text: `You can press [[${arrowUpHook}]] to quickly edit your most recent message.`, weight: 1 },
    // Tips
    { text: "You can drag and drop files onto SparkleCord to upload them.", weight: 1 },
    { text: "\\Do **this** for bold, *this* for italic, and the rest? idk i'll get them later.\\", weight: 1 },
    { text: "Customize SparkleCord's appearance in the user settings menu.", weight: 1 },
    { text: "You can right click a message to Edit, [Delete]{var(--status-danger)}, And more!", weight: 1 },
    // Custom SparkleCord lines
    { text: "There was an error loading SparkleCord, have a 🗣🔥 instead :D", weight: 1 },
    { text: "Loading the loading line, Please wait... ↻", weight: 1 },
    { text: "Messages aren't stored anywhere!", weight: 1 },
    { text: "hello bob...", weight: 1 },
    { text: "99% of people are chronically on Discord. Be happy you're the 1% using SparkleCord.", weight: 1, author: "gdtapioka" },
    { text: "too lazy to add a loading screen message, check back later.", weight: 1, author: "gdtapioka" },
    { text: "doctoon was here", weight: 1 },
    { text: "Big Berry saved our logo from being just a white sparkle emoji.", weight: 1 },
    { text: "SparkleCord was created on a Thursday at 11:43:41 PM GMT+2.", weight: 1 },
    { text: "I'm NEVER adding official light mode support, sorry bub.", weight: 1 },
    { text: "SparkleCord will always be a web-based app.", weight: 1 },
    // Time-specific lines
    { text: "I used SparkleCord at 3 AM (Gone Wrong) (Police Called) 😱😱😱", condition: () => getUTCDate().getHours() === 3, weight: 10 },
    // Holiday-specific lines
    { text: "Merry Halloween! I hope you got your easter eggs... wait... did I say that right?", holiday: "HALLOWEEN", weight: 3 },
    { text: "All I want for christmas... is meeeeeeee.....", holiday: "CHRISTMAS", weight: 3 },
     // Condition-specific lines
    { text: "SparkleCord: Best experienced under the moonlight. 🌙", condition: () => { let h = getUTCDate().getHours(); return h >= 20 || h < 6; }, weight: 10 },
    { text: localStorage.getItem("custom-loading-line") || "", condition: () => JSON.parse(localStorage.getItem("custom-line-enabled") || "false"), weight: 50000 },
    { text: "You're not supposed to see this. 👀", condition: () => JSON.parse(localStorage.getItem("secret-setting") || "false"), weight: 10 },
    { text: `Welcome back, ${JSON.parse(localStorage.getItem("profile") || "{}").name || "User"}!`, condition: () => true, weight: 1 },
    { text: `Loading... Status: ${JSON.parse(localStorage.getItem("profile") || "{}").status || "Online"}`, condition: () => true, weight: 1 }
];
const getUTCDate = (dateString = null) => {
    if (dateString) return new Date(dateString);
    return new Date();
    //return new Date('2025-10-31 03:00:00');
};
const isHoliday = (date) => {
    const month = date.getUTCMonth(), day = date.getUTCDate(), holidays = {
        BIRTHDAY_DISCORD: { month: 5, start: 13, end: 20 }, // May 13th
        BIRTHDAY: { month: 2, start: 29, end: 30 }, // February 29th - February 30th
        HALLOWEEN: { month: 10, start: 1, end: 31 }, // October 1 - October 31st
        CHRISTMAS: { month: 12, start: 1, end: 31 }, // December 1 - December 31st
    };
    for (const [name, period] of Object.entries(holidays)) { if (month === (period.month - 1) && day >= period.start && day <= period.end) { return name; } }
    return null;
};
const getSpinnerPath = (holiday) => {
    let spinners = {
        BIRTHDAY_DISCORD: './assets/loading/Discord.gif',
        BIRTHDAY: './assets/loading/Birthday.gif',
        HALLOWEEN: './assets/loading/Halloween.gif',
        CHRISTMAS: './assets/loading/Christmas.gif',
        DEFAULT: './assets/loading/Default.gif'
    };
    if (document.documentElement.classList.contains("theme-light")) {
        spinners.BIRTHDAY_DISCORD = './assets/loading/Discord-Light.gif';
        spinners.BIRTHDAY = './assets/loading/Birthday-Light.gif';
    }
    return spinners[holiday] || spinners.DEFAULT;
};
const updateSpinner = () => { 
    const spinner = document.getElementById('spinner'), currentHoliday = isHoliday(getUTCDate()); spinner.src = getSpinnerPath(currentHoliday); 
};
function showLoadingScreen(loadingTime) {
    function getRandomLine() {
        const currentDate = getUTCDate(), currentHoliday = isHoliday(currentDate);
        const validLines = LOADING_LINES.filter(line => {
            if (line.holiday && line.holiday !== currentHoliday) return false;
            if (line.condition && !line.condition()) return false;
            return true;
        });
        const totalWeight = validLines.reduce((sum, line) => sum + (line.weight || 1), 0);
        let random = Math.random() * totalWeight;
        for (const line of validLines) { random -= (line.weight || 1); if (random <= 0) return line.text; }
        return validLines[0].text;
    }
    function showLoadingLine() {
        const line = document.getElementById('loading-line'), header = document.getElementById('loading-text'), randomLine = getRandomLine();
        // const randomLine = LOADING_LINES[0];
        header.innerHTML = 'Did You Know';
        header.classList.remove("loadError")
        line.innerHTML = parseMarkdown(randomLine);
        line.classList.remove("loadError")
        updateSpinner();
    }
    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hide');
    }
    showLoadingLine();
    setTimeout(hideLoadingScreen, loadingTime);
}

new MutationObserver(m=>m.some(x=>x.attributeName=='class'&&updateSpinner())).observe(document.documentElement,{attributes:1,attributeFilter:['class']});

// Functoins
function initConsoleMessages() {
    console.log("%cHold Up!", 
        "color: #5865f2; -webkit-text-stroke: 2px black; font-size: 72px; font-weight: bold; font-family: 'Consolas';");
    console.log("%cThere is no hidden developer or online mode, the only developer options are there for testing and debugging and are already available.", 
        "font-size: 16px; font-family: 'Consolas';");
    console.log("%cWith this update, light mode is officially supported, just run the following snippet: 'document.documentElement.classList.add(\"theme-light\")' ",
        "color: red; font-size: 18px; font-weight: bold; font-family: 'Consolas';");
    console.log("%cMake sure to never run scripts from untrusted sources! If where you got the script looks sketchy, don't run it.", 
        "color: font-size: 16px; font-family: 'Consolas';");
    console.log("%cIf you have any internal questions about SparkleCord, just DM me on Discord (doctoon).", 
        "color: font-size: 16px; font-family: 'Consolas';");
}
// amazing function i love
function updateSendButtonColor({ attachments = [] } = {}) {
    const sendButton = $("send-btn")
    if (sendButton.querySelector("path")) {
        const path = sendButton.querySelector("path"), input = $("input-box"), text = input?.value?.trim();
        if (path) {
            if (text || attachments.length > 0) {
                path.setAttribute("fill", "var(--control-brand-foreground-new)");
                sendButton.style.cursor = "pointer";
                sendButton.onmouseenter = () => path.setAttribute("fill", "var(--text-brand)");
                sendButton.onmouseleave = () => path.setAttribute("fill", "var(--control-brand-foreground-new)");
            } else {
                path.setAttribute("fill", "var(--interactive-muted)");
                sendButton.style.cursor = "not-allowed";
                sendButton.onmouseenter = sendButton.onmouseleave = null;
            }
        }
    }
}
// UI Notice System
const NOTICE_TYPES = ['positive', 'warning', 'alert', 'info', 'streamer_mode', 'spotify', 'playstation', 'neutral', 'brand', 'danger', 'lurking', 'nitro1', 'nitro2', 'nitro3'];
function hideNotice(persist, id) {
    console.log("hideNotice id: " + id);
    document.querySelector(".notice").style.display = 'none';
    localStorage.setItem(`notice-${id}-dismissed`, `${persist}`);
}
function showNotice(data = {type: "positive", text: "", buttonText: "", buttonOnClick: "", id: `default`, persist: "true"}) {
    const noticeCloseSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z"></path></svg>`;
    const noticeCloseButton = `<div class="notice-close">${noticeCloseSVG}</div>`;

    console.log("showNotice data.id: " + data.id);
    if (!NOTICE_TYPES.includes(data.type)) return;
    const notice = document.querySelector(".notice")
    if (localStorage.getItem(`notice-${data.id}-dismissed`) === "true") return notice.style.display = "none"; 
    notice.className = `notice ${data.type}`
    notice.innerHTML = `${noticeCloseButton} ${data.text} ${data.buttonText ? `<button ${data.buttonOnClick ? `onclick="${data.buttonOnClick}"` : ``} >${data.buttonText}</button>` : ''}`;

    document.querySelector(".notice-close").setAttribute("onclick", `hideNotice('${data.persist || "true"}', '${data.id}')`)
    notice.style.display = "block";
}
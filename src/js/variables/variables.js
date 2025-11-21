// Utility Functions
const speak = t => speechSynthesis.speaking || speechSynthesis.speak(new SpeechSynthesisUtterance(t));

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

// System users list

let systemUsers = {
    core: {
        name: "Byte",
        username: "byte",
        avatar: "./assets/avatars/core/bye.png",
        id: 1n,
        tag: { name: "Bot", verified: true, bg: "var(--bg-brand)" },
    },
    error: {
        name: "Uh Oh!",
        username: "clyde_err",
        avatar: "./assets/avatars/core/Clyde-Old.jpg",
        id: 2n,
        tag: { name: "Error", verified: false, bg: "var(--red-500)" },
        color: 'var(--text-danger)',
    },
    ai: {
        name: "Sparkly",
        username: `sparkly`,
        avatar: "./assets/avatars/core/sparkly.png",
        id: 3n,
        tag: { name: "AI", verified: false, bg: "var(--green-360)" },
    },
    byte: {
        name: "Byte",
        username: "byte",
        avatar: "./assets/avatars/core/bye.png",
        id: 4n,
        tag: { name: "Bot", verified: false, bg: "var(--bg-brand)" },
    },
    clyde: {
        name: "Clyde",
        username: "clyde",
        avatar: "./assets/avatars/core/Clyde.gif",
        id: 5n,
        tag: { name: "Bot", verified: false, bg: "var(--bg-brand)" },
    }
};
let sysGroups = { core: null, error: null, ai: null, byte: null };

// Human users list
let humans = {
    self: JSON.parse(localStorage.getItem("profile")) || {},
};
// Combined
let profiles = {
    ...humans,
    ...systemUsers
};

// Profile Setup
if (!humans.self.username) humans.self.username = generateUsername(true);
if (!humans.self.name) humans.self.name = humans.self.username;
if (!humans.self.avatar) humans.self.avatar = `./assets/avatars/${rand(0, 18)}.png`;
if (!humans.self.defaultAvatar) humans.self.defaultAvatar = humans.self.avatar;
if (!humans.self.status) humans.self.status = "Online";
if (!humans.self.id) humans.self.id = snflk(Date.now()).toString();
localStorage.setItem("profile", JSON.stringify(humans.self));
humans.self.id = BigInt(humans.self.id);

// Mentions
function getMentions(text) {
    function getUserById(id) {
        return Object.values(systemUsers).find(u => u.id === BigInt(id)) || 
               Object.values(profiles).find(u => u.id === BigInt(id));
    }
    function getUserByUsername(username) {
        username = username.toLowerCase();
        return Object.values(profiles).find(u => 
            (u.username && u.username.toLowerCase() === username) ||
            (u.name && u.name.toLowerCase() === username)
        );
    }
    const mentionRegex = /<@(\d+)>|@([a-zA-Z0-9_]+)/g;
    return text.replace(mentionRegex, (fullMatch, mentionId, mentionUsername) => {
        if (mentionUsername && ['everyone', 'here'].includes(mentionUsername.toLowerCase())) {
            return `<span class="ping">@${mentionUsername}</span>`;
        }
        let user = null;
        if (mentionId) {
            user = getUserById(mentionId);
        } else if (mentionUsername) {
            user = getUserByUsername(mentionUsername);
        }
        
        return user ? `<span class="ping">@${user.name}</span>` : fullMatch;
    });
}
function checkMentions(text) {
    if (!humans.self || !humans.self.id) return false;
    if (text.includes(`<@${humans.self.id}>`)) return true;
    if (text.includes(`@everyone`) || text.includes(`@here`) ) return true;
    const usernameMention = humans.self.username && text.includes(`@${humans.self.username}`);
    const nameMention = humans.self.name && text.includes(`@${humans.self.name}`);
    return usernameMention || nameMention;
}

// Global Variables
let messageGroups = [], lastMessageTimestamp = null, currentMessageGroup = null, history = [""], historyIndex = 0;
let lastMessage = null, lastMessageAuthor = null, lastMessageAvatar = null, sendButton = null;
let currentAttachments = [];

const LOADING_TIME = rand(3000, 6500); // Milliseconds
const SETTINGS_TIMEOUT = 10; // Since settings elements are dynamically injected, this is to wait until the elements are FULLY there to prevent errors.
const arrowLeftHook = "←", arrowUpHook = "↑", arrowRightHook = "→", arrowDownHook = "↓";

const DEFAULT_COLOR = "var(--header-primary)";
const HOLOGRAPHIC_COLOR1 = "#a9c9ff";
const HOLOGRAPHIC_COLOR2 = "#ffbbec";
const HOLOGRAPHIC_COLOR3 = "#ffc3a0";

// Strings
const defaultEmojiDesc = "A default emoji. You can use this emoji everywhere on SparkleCord.";
const blockMessage = `This can't be posted because it contains content blocked by SparkleCord.`;
const userBlockMessage = `This can't be posted because it contains content you chose to block.`;

// Replies
let R_TOGGLE, R_INDICATOR, messageInput, sendBtn;
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
    sendBtn = $("send-btn"); R_TOGGLE = $("ping-toggle"); R_INDICATOR = $("reply-indicator"); messageInput = $("input-box");
    R_TOGGLE.addEventListener("click", function() { toggleReplyPing(); });
})

// Version Info
const versionCode = "1.4.0", versionState = "stable", versionType = "Client", versionName = "Sparked Alive";
const versionHTML = `SparkleCord ${versionType} Version ${versionCode} <br>(${versionState}) ${versionName ? `- ${versionName}` : ``}`;

// Loading and Initialization
const rootPath = (() => {
    const path = window.location.href;
    if (window.location.protocol === 'file:') { return path.substring(0, path.lastIndexOf('/') + 1); }
    return window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
})();

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
    { text: "There was a time where SparkleCord would've still been JSONCord...", weight: 1 },
    { text: "doctoon was here", weight: 1 },
    { text: "Big Berry saved our logo from being just a white sparkle emoji.", weight: 1 },
    { text: "SparkleCord was created on a Thursday at 11:43:41 PM GMT+2.", weight: 1 },
    { text: "SparkleCord will always be a web-based app. (maybe)", weight: 1 },
    // Time-specific lines
    { text: "I used SparkleCord at 3 AM (Gone Wrong) (Police Called) 😱😱😱", condition: () => getUTCDate().getHours() === 3, weight: 10 },
    // Holiday-specific lines
    { text: "Merry Halloween! I hope you got your easter eggs... wait... did I say that right?", holiday: "HALLOWEEN", weight: 3 },
    { text: "All I want for christmas... is meeeeeeee.....", holiday: "CHRISTMAS", weight: 3 },
     // Condition-specific lines
    { text: "SparkleCord: Night Shift Edition", condition: () => { let h = getUTCDate().getHours(); return h >= 20 || h < 6; }, weight: 10 },
    { text: localStorage.getItem("custom-loading-line") || "", condition: () => JSON.parse(localStorage.getItem("custom-line-enabled") || "false"), weight: 50000 },
    { text: "You're not supposed to see this... OH SH-", condition: () => JSON.parse(localStorage.getItem("secret-setting") || "false"), weight: 10 },
    { text: `Welcome back, ${JSON.parse(localStorage.getItem("profile") || "{}").name || "User"}!`, condition: () => true, weight: 1 },
];
const getUTCDate = (dateString = null) => {
    if (dateString) return new Date(dateString);
    return new Date(); // For debugging, you may input a test date, such as '2025-10-31 03:00:00' inside the return statement.
};
const isHoliday = (date) => {
    const month = date.getUTCMonth(), day = date.getUTCDate(), holidays = {
        BIRTHDAY_DISCORD: { month: 5, start: 13, end: 20 }, // May 13th - May 20th
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
        if (holiday === "BIRTHDAY_DISCORD") spinners.BIRTHDAY_DISCORD = './assets/loading/Discord-Light.gif';
        if (holiday === "CHRISTMAS") spinners.CHRISTMAS = './assets/loading/Christmas-Light.gif';
    }
    return spinners[holiday] || spinners.DEFAULT;
};
const updateSpinner = () => { 
    const spinner = $('spinner'), currentHoliday = isHoliday(getUTCDate()); spinner.src = getSpinnerPath(currentHoliday); 
};
function showLoadingScreen(loadingTime) {
    function getRandomLine() {
        const currentDate = getUTCDate(), currentHoliday = isHoliday(currentDate);
        const validLines = LOADING_LINES.filter(line => {
            if (!line.text) return false;
            if (line.holiday && line.holiday !== currentHoliday) return false;
            if (line.condition && !line.condition()) return false;
            return true;
        });
        if (!validLines.length) {
            console.warn("No valid lines found");
            return "Loading...";
        }
        const totalWeight = validLines.reduce((sum, line) => sum + (line.weight || 1), 0);
        let random = Math.random() * totalWeight;
        for (const line of validLines) {
            random -= (line.weight || 1);
            if (random <= 0) {
                return line.text;
            }
        }        
        return validLines[0].text;
    }
    function showLoadingLine() {
        const line = $('loading-line'), header = $('loading-text'), randomLine = getRandomLine();
        // const randomLine = LOADING_LINES[0]; // Force one of the existing lines based on array index.
        header.innerHTML = 'Did You Know';
        line.innerHTML = parseMarkdown(randomLine);
        line.classList.remove("loadError"); header.classList.remove("loadError"); // Remove any classes related to loading errors if showLoadingScreen successfully runs without errors beforehand.
        updateSpinner();
    }
    function hideLoadingScreen() {
        const loadingScreen = $('loading-screen');
        loadingScreen.classList.add('hide');

        eventBus.emit("loaded", { timestamp: Date.now() });
    }
    showLoadingLine();
    setTimeout(hideLoadingScreen, loadingTime);
}

new MutationObserver(m=>m.some(x=>x.attributeName=='class'&&updateSpinner())).observe(document.documentElement,{attributes:1,attributeFilter:['class']});

// Functoins
const debugLogsEnabled = false;
function debugLog(content) {
    if (debugLogsEnabled) console.log("%c[DEBUG]", "color:rgb(175, 64, 202);", content);
    else return;
}

if (location.protocol.startsWith("http")) {
    let link = document.createElement("link"); link.rel = "manifest"; link.href = "./assets/PWA/manifest.json"; document.head.appendChild(link);
    window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); setTimeout(() => e.prompt(), 3000); });
} else {
   // console.log("%c[WARNING]", "color: orange; font-weight: bold;", "To use the PWA (Progressive Web App) version of SparkleCord, You need to host it on a http/https server. Then click the install button.");
}
// console.log('SparkleCord\'s Root/index.html Path: ', rootPath + 'index.html')

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
// Update Send Button Color
function updateSendButtonColor({ attachments = [] } = {}) {
    const sendButton = $("send-btn")
    if (sendButton.querySelector("path")) {
        const path = sendButton.querySelector("path"), input = $("input-box"), text = Parser.trim(input.value);
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
function hideNotice(persist, id) { document.querySelector(".notice").style.display = 'none'; localStorage.setItem(`notice-${id}-dismissed`, `${persist}`); }
function showNotice(data = {type: "positive", text: "", buttonText: "", buttonOnClick: "", id: `default`, persist: "true"}) {
    const getIndefiniteArticle = (word) => { 
        word = word.toLowerCase(); if (['honest','honor','hour','heir'].includes(word)) return 'an'; if (/^u(?![aeiou])|^uni|^use|^user|^ut/.test(word)) return 'a'; if (/^[aeiouh]/.test(word)) return 'an'; return 'a'; 
    }

    const noticeCloseSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z"></path></svg>`;
    const noticeCloseButton = `<div class="notice-close">${noticeCloseSVG}</div>`;
    if (!NOTICE_TYPES.includes(data.type)) data.type = "positive";

    const notice = document.querySelector(".notice")
    if (localStorage.getItem(`notice-${data.id}-dismissed`) === "true") {
        console.log(`Unable to show notice with ID as ${data.id} due to the 'notice-${data.id}-dismissed' localStorage key's value being 'true'.`);
        return notice.style.display = "none";
    } else {
        console.log(`Showed ${getIndefiniteArticle(data.type)} ${data.type} notice with ID as ${data.id}, and ${data.persist && data.persist === "true"  ? `when closing, a notice with the ID as '${data.id}' is unable to be` : `when closing, a notice with the ID as '${data.id}' is able to be`} shown again.`);
    }
    notice.className = `notice ${data.type}`
    notice.innerHTML = `${noticeCloseButton} ${data.text} ${data.buttonText ? `<button ${data.buttonOnClick ? `onclick="${data.buttonOnClick}"` : ``} >${data.buttonText}</button>` : ""}`;

    document.querySelector(".notice-close").setAttribute("onclick", `hideNotice('${data.persist || "true"}', '${data.id}')`)
    notice.style.display = "block";
}
/* Some examples
    showNotice({ type: "alert", text: "gfdgfdgfdgfdhfdhs", id: `alerttest` });
    showNotice({ type: "lurking", text: "You are currently in preview mode. Join this server to start chatting!", id: `lurkTest`, buttonText: "Join TEST_SERVER" });
    showNotice({ type: "warning", text: "Your Nitro sub is about to run out, add payment info to keep using Nitro.", id: `nitro_expiration`, buttonText: "Go to settings" });
*/
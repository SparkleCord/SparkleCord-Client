let messageGroups = [], lastMessageTimestamp = null, currentMessageGroup = null, history = [""], historyIndex = 0;
let lastMessage = null, lastMessageAuthor = null, lastMessageAvatar = null, sendButton = null;
let currentAttachments = [];

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
        avatar: "./assets/avatars/core/byte.png",
        id: 1n,
        tag: { name: "Bot", verified: true, bg: "var(--bg-brand)" },
    },
    byte: {
        name: "Byte",
        username: "byte",
        avatar: "./assets/avatars/core/byte.png",
        id: 2n,
        tag: { name: "Bot", verified: false, bg: "var(--bg-brand)" },
    }
}, sysGroups = { core: null, byte: null };

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
if (!humans.self.avatar) humans.self.avatar = `./assets/avatars/${rand(0, 5)}.png`;
if (!humans.self.defaultAvatar) humans.self.defaultAvatar = humans.self.avatar;
if (!humans.self.status) humans.self.status = "Online";
if (!humans.self.id) humans.self.id = snflk(Date.now()).toString();
localStorage.setItem("profile", JSON.stringify(humans.self));
humans.self.id = BigInt(humans.self.id);

// Mentions
function getMentions(text) {
    function getUserById(id) {
        return Object.values(systemUsers).find(u => u.id === BigInt(id)) || Object.values(profiles).find(u => u.id === BigInt(id));
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
        if (mentionUsername && ["everyone", "here"].includes(mentionUsername.toLowerCase())) {
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
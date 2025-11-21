// System Automod (Built-In)
const blockedStrings = [
    // actual bad phrases
    "heil hitler",
];
const blockedMatches = [
    /\b(n+i+g+g+|f+a+g+|r+e+t+a+r+d+|t+r+a+n+n+y+|k+i+k+|s+l+a+n+t+|g+y+p+s+y+|w+e+t+b+a+c+k+)\w*\b/i, // slurs
    /\b(neo\s*nazi|kkk|klan\s*member)\b/i // hate groups
];
const systemExceptions = [];

// User-set Automod (This is basically vencord's TextReplace plugin except instead of replacing it blocks you from sending the message)
let userBlockedStrings = [ ];
let userBlockedMatches = [ ];
let userExceptions = [];

userBlockedStrings = JSON.parse(localStorage.getItem("userBlockedStrings")) || []; 
userBlockedMatches = JSON.parse(localStorage.getItem("userBlockedMatches")) || [];
userExceptions = JSON.parse(localStorage.getItem("userExceptions")) || []; 
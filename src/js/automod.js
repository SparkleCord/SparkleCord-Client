// System Automod (Built-In)
const blockedStrings = [
    // actual bad words
    "*rape*", "*pedo*", "*groomer*", "child predator", // Blocks inappropriate content
    "*hate crime*", "*terroris*", "*extremis*", "white power", "heil hitler", // Blocks offensive/violent content
    // Test phrases / words, please ignore.
];
const blockedMatches = [
    /\b(n+i+g+|f+a+g+|r+e+t+a+r+d+|t+r+a+n+n+y+|k+i+k+|s+l+a+n+t+|g+y+p+s+y+|w+e+t+b+a+c+k+)\w*\b/i, // Blocks slurs
    /\b(neo\s*nazi|kkk|klan\s*member)\b/i // Blocks hate group references
];
const systemExceptions = [
    "*grape*", // Prevents false positives where terms like "rape" are used in context (e.g., grape as a fruit)
    "*terrorist group*", "*extremism prevention*", "*terrorism stud*", // Phrases that involve sensitive topics but in a neutral context
    "*counter-extremism*",  // Harmless terms that might be flagged but are positive or neutral
];

// User's Automod (This is basically vencord's TextReplace plugin except instead of replacing it blocks you from sending the message)
let userBlockedStrings = [ ];
let userBlockedMatches = [ ];
let userExceptions = [];

userBlockedStrings = JSON.parse(localStorage.getItem("userBlockedStrings")) || []; 
userBlockedMatches = JSON.parse(localStorage.getItem("userBlockedMatches")) || [];
userExceptions = JSON.parse(localStorage.getItem("userExceptions")) || []; 
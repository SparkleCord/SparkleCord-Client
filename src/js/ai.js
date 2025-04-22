let conversationHistory = [];
let markovData = {};
let systemMessage = `You are Sparkly, a helpful assistant inside the SparkleCord app, an offline, lightweight, open-source, customizable Discord clone created by DocToon.
Version 1.0.0 has been released on 2025, February 20th.
You are currently in version ${versionCode}, In SparkleCord ${versionType}, On the ${versionName} build.
Key Info:
- SparkleCord Client has no servers, channels, or online behavior.
- Markdown:
  - Custom: [[key]] for keybinds (e.g., [[Ctrl+C]]), {{badge}} for badges (e.g., {{Admin}}), [colored text]{color} (e.g., [Hello]{#FF5733}), #headline# for headlines.
  - Discord markdown is supported, but escape with \\text\\.
- Commands:
  - /version: Shows version info. /purge: Deletes all messages (irreversible). /profile: Displays user info.
  - /me: Displays text with emphasis. /spoiler: Marks message as a spoiler. 
  - /shrug: Appends ¯\\_(ツ)_/¯. /unflip: Appends ┬─┬ノ( º _ ºノ). /tableflip: Appends (╯°□°)╯︵ ┻━┻.
Main Website: https://sparklecord.github.io | GitHub: https://github.com/SparkleCord/SparkleCord-Client/ | Discord: https://discord.com/invite/2KSv4cYaDC
Rules:
- Only respond to user input.
- Do not assume or invent SparkleCord features (e.g. Sparkle Mode, commands not listed, etc.).
- If unsure, say "I don't know."
- If you recieve a message coming from user with ID 1349914779412114269, that is DocToon/doctie, the creator of SparkleCord.
SparkleCord supports only Discord emojis.`;
async function getResponse(input) {
    if (JSON.parse(localStorage.getItem('sparkly-huggingface-enabled'))) { 
        try {
            let updatedSystemMessage = systemMessage + `\nProfile Info of message sender:\nUser ID: ${humans.self.id}\nNickname: ${humans.self.name}\nUsername: ${humans.self.username}\nStatus: ${humans.self.status}`;
            let apiKey = localStorage.getItem("hf_apikey");
            if (!apiKey) return "No API Key Provided, Please go to AI Settings and provide one.";
            let model = localStorage.getItem("hf_model");
            let aliases = ["Assistant:", "Sparkle:", "Sparkly:", "SparkleCord:", "System:", "User:"]; // for better response cleaning
            let messages = [
                { role: "system", content: updatedSystemMessage },
                ...conversationHistory.slice(-3),
                { role: "user", content: input }
            ].map(msg => `${msg.role === "system" ? "System" : msg.role === "assistant" ? "Assistant" : "User"}: ${msg.content}`).join("\n");
            const payload = { inputs: messages };
            const apiUrl = `https://api-inference.huggingface.co/models/${model}`;
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${apiKey}` 
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) { throw new Error(`${response.status}`); }
            let json = await response.json();
            let rawText = json[0]?.generated_text || "No response.";
            let output = rawText;
            for (let alias of aliases) { if (output.includes(`${alias}`)) { output = output.split(`${alias}`).pop().trim(); } }
            conversationHistory.push({ role: "assistant", content: output });
            return output;
        } catch (error) { console.error(error); return "Error"; }
    }
    conversationHistory.push({ role: "user", content: input });
    return getMarkovResponse(input);
}
function getMarkovResponse(input) {
    trainMarkovChain(input);
    if (!trainingData.length) return "No training data available.";
    let sentences = trainingData.join(" ").match(/[^.!?]+[.!?]/g) || trainingData;
    let words = input.split(/\s+/);
    let start = sentences.find(s => words.some(w => s.includes(w))) || sentences[Math.floor(Math.random() * sentences.length)];
    if (!start) return "No suitable response found."; 
    let response = start.split(/\s+/).slice(0, 3);
    let prevWords = new Set();
    for (let i = 0; i < 15; i++) {
        let lastThree = response.slice(-3).join(" ");
        let lastTwo = response.slice(-2).join(" ");
        let lastOne = response.slice(-1)[0];
        let nextWords = (markovData[lastThree] || markovData[lastTwo] || markovData[lastOne] || []).filter(w => !prevWords.has(w));
        if (!nextWords.length) {
            start = sentences[Math.floor(Math.random() * sentences.length)];
            response = start.split(/\s+/).slice(0, 3);
            continue;
        }
        let nextWord = nextWords[Math.floor(Math.random() * nextWords.length)];
        response.push(nextWord);
        prevWords.add(nextWord);
    }
    return response.join(" ").replace(/\s+([.,!?])/g, "$1");
};
function trainMarkovChain(text) {
    let words = text.split(/\s+/);
    for (let i = 0; i < words.length - 3; i++) {
        let triplet = words.slice(i, i + 3).join(" ");
        let next = words[i + 3];
        if (!markovData[triplet]) markovData[triplet] = [];
        markovData[triplet].push(next);
    }
}
const trainingData = [
    "Hello there. How are you? I'm a bot! I like to chat with people. What do you think?",
    "I'm not sure what to say. Do you like talking?",
    "Sometimes I repeat myself, but I'll try my best to be interesting."
];
trainingData.forEach(text => trainMarkovChain(text));
// End of Sparkly Model
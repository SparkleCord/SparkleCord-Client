// Timestamps
function formatTimestamp(timestamp, grouped = false) {
    let date = new Date(timestamp), now = new Date(), timeString = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (!grouped) {
        let dateString = date.toLocaleDateString("en-US"); // Change to "en-GB" for DD/MM/YYYY
        if (date.toDateString() === now.toDateString()) return `Today at ${timeString}`;
        now.setDate(now.getDate() - 1); if (date.toDateString() === now.toDateString()) return `Yesterday at ${timeString}`;
        now.setDate(now.getDate() + 2); if (date.toDateString() === now.toDateString()) return `Tomorrow at ${timeString}`;
        return `${dateString} ${timeString}`;
    } else {
        return timeString;
    }
}

function updateTimestamps() {
    function parseTimestamp(text) {
        const now = new Date();
        if (text === "Today") return now.toISOString();
        if (text === "Yesterday") return new Date(now.setDate(now.getDate() - 1)).toISOString();
        if (text === "Tomorrow") return new Date(now.setDate(now.getDate() + 1)).toISOString();
        const match = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (match) return new Date(match[3], match[1] - 1, match[2]).toISOString();
        return null;
    }
    document.querySelectorAll(".timestamp").forEach(element => {
        if (!element.closest(".grouped")) {
            const timestamp = element.dataset.timestamp;
            if (timestamp) element.textContent = formatTimestamp(new Date(timestamp).toISOString());
        }
    });    
    document.querySelectorAll(".embed-footer-text").forEach(element => {
        const match = element.textContent.match(/(Today|Yesterday|Tomorrow|\d{1,2}\/\d{1,2}\/\d{4})$/);
        if (match) {
            const timestamp = parseTimestamp(match[1]);
            if (timestamp) element.textContent = element.textContent.replace(match[1], formatTimestamp(new Date(timestamp).toISOString()));
        }
    });
}

setInterval(updateTimestamps, 1000);

if (!window._spoilerHandlerAdded) {
    document.addEventListener("click", (e) => { if (e.target.classList.contains("spoiler")) { e.target.classList.toggle("revealed"); } });
    window._spoilerHandlerAdded = true;
}
// snmowflakezs
function generateSnowflake(date) {
    const timestamp = BigInt(date) - BigInt(1420070400000), random = BigInt(Math.floor(Math.random() * 0x100000000)); 
    return (timestamp << 22n) | random;
}
// Scroll to Bottom
function scrollToBottom() { const messagesContainer = $("messages"); messagesContainer.scrollTop = messagesContainer.scrollHeight; }
// highlight syntax
function applyHighlighting(messageElement) {
    const codeBlocks = messageElement.querySelectorAll("pre code");
    codeBlocks.forEach(codeBlock => {
        const langClass = codeBlock.className.replace("hljs", "").replace("language-", "").trim();
        loadHighlight(langClass).then(() => {
            const code = codeBlock.textContent;
            try {
                const highlighted = hljs.highlight(code, { language: HLJS_ALIASES[langClass] || langClass || "plaintext", ignoreIllegals: true }).value;
                codeBlock.innerHTML = highlighted;
                addCopyButton(codeBlock.parentElement);
            } catch (err) {
                console.warn("Highlighting failed, falling back to plaintext:", err);
                codeBlock.innerHTML = hljs.highlight(code, { language: "plaintext", ignoreIllegals: true }).value;
                addCopyButton(codeBlock.parentElement);
            }
        }).catch(err => { console.error("Highlight error:", err); codeBlock.textContent = codeBlock.textContent; });
    });
}
// prevent people from trying to run code using html so people don't try hacking and shit
function sanitizeInput(input) {
    // return input;
    return input.replace(/(```[\s\S]*?```|`[^`\n]*`)|([<>&""`])/g, (match, codeBlock, char) => 
        codeBlock ? match : (char === ">" && match === char) ? ">" : {"<": "&lt;", "&": "&amp;", "'": "&quot;", "'": "&#39;", "`": "&#96;"}[char]
    );       
}
// jump to message, used in replies and message links though message links aren't implemented yet
function jumpToMsg(id) {
    const msg = $(id); if (!msg) return;
    setTimeout(() => msg.classList.add("replying", "highlight"), 0);
    msg.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => msg.classList.remove("replying", "highlight"), 260);
}
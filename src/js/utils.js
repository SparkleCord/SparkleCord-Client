// small functions that are used for most of the app
const speak = t => speechSynthesis.speaking || speechSynthesis.speak(new SpeechSynthesisUtterance(t));
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const snflk = d => ((BigInt(d) - 1420070400000n) << 22n) | BigInt(rand(0, 0xFFFFFFFF));

// create an element with an optional namespace
function el(type, attrs, ns) {
    const u = "http://www.w3.org", nss = { svg: `${u}/2000/svg`, xhtml: `${u}/1999/xhtml`, mathml: `${u}/1998/Math/MathML` }, nsu = ns ? nss[ns] : nss["xhtml"];
    const e = document.createElementNS(nsu, type);

    for (const k in attrs) {
        if (k === "dataset") {
            Object.assign(e.dataset, attrs[k]);
        } else {
            if (nsu === nss.xhtml || ["innerHTML", "id", "className", "textContent"].includes(k)) {
                e[k] = attrs[k];
            } else {
                e.setAttribute(k, attrs[k]);
            }
        }
    }
    return e;
}

// get an element
function $(q, mult = false, scope = document) {
    if (mult) return scope.querySelectorAll(q);
    else return scope.querySelector(q);
}

// modify an element
function $$(e, attrs) {
    for (const k in attrs) {
        if (k === "dataset") {
            Object.assign(e.dataset, attrs[k]);
        } else {
            if (e.namespaceURI === "http://www.w3.org/1999/xhtml" || ["innerHTML", "id", "className", "textContent"].includes(k)) {
                e[k] = attrs[k];
            } else {
                e.setAttribute(k, attrs[k]);
            }
        }
    }
    return e;
}

// remove an element
function r(e, parent) {
    if (parent) return parent.removeChild(e);
    return e.remove();
}


/* =========== */
// Timestamps (messages and embeds)
function formatTimestamp(timestamp, grouped = false) {
    const showTodayAt = localStorage.getItem("show-today-at") !== "false";
    let date = new Date(timestamp), now = new Date(), timeString = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (!grouped) {
        let dateString = date.toLocaleDateString("en-US"); // Change to "en-GB" for DD/MM/YYYY
        if (date.toDateString() === now.toDateString()) return `${showTodayAt ? "Today at" : ""} ${timeString}`;
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
            if (element.dataset.timestamp) {
                element.textContent = formatTimestamp(new Date(element.dataset.timestamp).toISOString());
            }
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
    const timestamp = BigInt(date) - BigInt(1420070400000);
    const random = BigInt(Math.floor(Math.random() * 0x100000000)); 
    return (timestamp << 22n) | random;
}
// Scroll to Bottom
function scrollToBottom() {
    const messagesContainer = $("#messages");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

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
    return input.replace(/(```[\s\S]*?```|`[^`\n]*`)|([<>&"`])/g, (match, codeBlock, char) => 
        codeBlock ? match : (char === ">" && match === char) ? ">" : {"<": "&lt;", "&": "&amp;", "\"": "&quot;", "'": "&#39;", "`": "&#96;"}[char]
    );
}

// jump to message, used in replies and message links though message links aren't implemented yet
function jumpToMsg(id) {
    const msg = $(`[id='${id}']`); if (!msg) return;
    setTimeout(() => msg.classList.add("replying", "highlight"), 0);
    msg.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => msg.classList.remove("replying", "highlight"), 260);
}

// reactions
function getReactionHTML(obj) {
    // structure: { emoji: "🐱", type: "regular", count: 1, reacted: false },

    const emojiText = replaceEmojis(replaceEmojiNames(obj.emoji) + " ", false, true);
    return `<div class="reaction${obj.reacted ? " reacted" : ""}${obj.type === "super" ? " super" : ""}" onclick="this.remove()">
                <div class="reaction-emoji">${emojiText}</div>
                <div class="reaction-emoji-amount">${obj.count}</div>
            </div>`;
}
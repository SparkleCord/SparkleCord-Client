/* Replies */
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
    sendBtn = $("#send-btn"); R_TOGGLE = $("#ping-toggle"); R_INDICATOR = $("#reply-indicator"); messageInput = $("#input-box");
    R_TOGGLE.addEventListener("click", function() { toggleReplyPing(); });
})

// Update Send Button Color
function updateSendButtonColor({ attachments = [] } = {}) {
    const sendButton = $("#send-btn")
    if (sendButton.querySelector("path")) {
        const path = sendButton.querySelector("path"), input = $("#input-box"), text = Parser.trim(input.value);
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
const NOTICE_TYPES = [
    "positive", "warning", "alert", "info", "streamer_mode",
    "spotify", "playstation", "neutral", "brand", "danger",
    "lurking", "nitro1", "nitro2", "nitro3"
];

function hideNotice(persist, id) {
    document.querySelector(`.notice[id='${id}']`).style.display = "none";
    localStorage.setItem(`notice-${id}-dismissed`, `${persist}`);
}

function showNotice(data = { type: "positive", text: "", buttonText: "", buttonOnClick: "", showCloseButton: true, id: "default", persist: "false" }) {
    if (!NOTICE_TYPES.includes(data.type)) data.type = "positive";
    if (!data.persist) data.persist = "false";
    if (!data.showCloseButton) data.showCloseButton = true;

    const getIndefiniteArticle = (word) => { 
        word = word.toLowerCase(); if (["honest","honor","hour","heir"].includes(word)) return "an"; if (/^u(?![aeiou])|^uni|^use|^user|^ut/.test(word)) return "a"; if (/^[aeiouh]/.test(word)) return "an"; return "a"; 
    }

    const noticeCloseButton = data.showCloseButton ? `<div class="notice-close" onclick="hideNotice('${data.persist || "true"}', '${data.id}')">${noticeCloseSVG}</div>` : "";

    const notice = document.querySelector(".notice");
    notice.id = data.id;
    notice.className = `notice ${data.type}`;

    if (localStorage.getItem(`notice-${data.id}-dismissed`) === "true") {
        console.log(`Unable to show notice with ID as ${data.id} due to the 'notice-${data.id}-dismissed' localStorage key's value being 'true'.`);
        return notice.style.display = "none";
    } else {
        console.log(
            `Showed ${getIndefiniteArticle(data.type)} ${data.type} notice with ID as ${data.id}, and when closing, a notice with the ID as '${data.id}' is ${data.persist && data.persist === "true" ?"un":""}able to be shown again.`
        );
    }

    notice.innerHTML = `${noticeCloseButton} ${data.text} ${data.buttonText ? `<button ${data.buttonOnClick ? `onclick="${data.buttonOnClick}"` : ``} >${data.buttonText}</button>` : ""}`;
    notice.style.display = "block";
}

/* Some examples
    showNotice({ type: "alert", text: "gfdgfdgfdgfdhfdhs", id: `alerttest` });
    showNotice({ type: "lurking", text: "You are currently in preview mode. Join this server to start chatting!", id: `lurkTest`, buttonText: "Join TEST_SERVER" });
    showNotice({ type: "warning", text: "Your Nitro sub is about to run out, add payment info to keep using Nitro.", id: `nitro_expiration`, buttonText: "Go to settings" });
*/

// Headers
function updateTitleHeader(data) {
    if (!data) data = { display: true, text: "Selfchat", icon: sparkleCordLogo };

    const header = $("#title-header");
    if (localStorage.getItem("show-header") === "false") {
        header.style.display = "none";
    } else {
        header.style.display = data.display ? "block" : "none";
    }

    header.innerHTML = `${data.icon} SparkleCord  —  ${data.text}`;
}
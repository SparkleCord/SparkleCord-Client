document.addEventListener("DOMContentLoaded", () => {
    // __________ Dynamic UI function calls / initializations ___________ \\

    debugLog("Attempting to run loadProfile()");
    loadProfile();
    debugLog("The function ran successfully! Attempting to run showNotice()");
    showNotice({ type: "warning", id: `unofficial_warning`,
        text: "Hey! What you're using right now is a fan-made client and not affiliated with Discord.",
    });
    debugLog("The function ran successfully! Attempting to run setTheme()");
    setTheme(localStorage.getItem("user-theme") || "dark");

    // __________ Settings Initialization ___________ \\
    
    debugLog("The function ran successfully! Attempting to run createSettingsPanel()");
    createSettingsPanel();
    settingsPanel = $("settings-panel");
    debugLog("The function ran successfully! Attempting to run closeSettingsPanel()");
    closeSettingsPanel();
    debugLog("The function ran successfully! Attempting to run applySettings()");
    applySettings();

    debugLog("The function ran successfully! Attempting to initialize MessageHoverButtons...");
    new MessageHoverButtons();
    debugLog("Sucess! Attempting to initialize AutoComplete...");
    const autoComplete = new AutoComplete($("input-box"), emojiUtils, commands);
    debugLog("Success! Attempting to initialize console messages...");

    // __________ Other Initializations ___________ \\

    initConsoleMessages();
    debugLog("The function ran successfully! Attempting to show the loading screen...");
    showLoadingScreen(LOADING_TIME);
    debugLog("Success! No more pre-load debugging needed.")

    console.log("%c_ And now, here comes the logs coming from everything else! _", 
        "font-size: 12px; font-family: 'Consolas';");

    // __________ Event Listeners  ___________ \\
    sendBtn.addEventListener("click", () => { sendMessage(); autoComplete.hide(); updateSendButtonColor(); });
    $("settings-btn").addEventListener("click", openSettingsPanel);
    $("attach-btn").addEventListener("click", handleFileAttachment);

    let typingTimeout;
    let isCurrentlyTyping = false;
    
    messageInput.addEventListener("input", () => {
        if (messageInput.value !== history[historyIndex]) {
            history = history.slice(0, historyIndex + 1);
            history.push(messageInput.value);
            historyIndex++;
            let f = false, nh = [];
            for (const i of history) {
                if (i !== "") { nh.push(i); f = true; } else if (!f) nh.push(i); 
            }
            history = nh;
            historyIndex = Math.min(historyIndex, history.length - 1);
        }
    
        updateSendButtonColor({ attachments: currentAttachments });
    
        if (!isCurrentlyTyping) {
            isCurrentlyTyping = true;
            eventBus.emit("isTyping", { text: messageInput.value, startTimestamp: Date.now() });
        }
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            isCurrentlyTyping = false;
            eventBus.emit("isTypingStop", { text: messageInput.value, timestamp: Date.now() });
        }, 3000);
    });    

    messageInput.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "z" && historyIndex > 0) { historyIndex--; messageInput.value = history[historyIndex]; e.preventDefault(); }
        if ((e.ctrlKey && e.key === "y") || (e.ctrlKey && e.shiftKey && e.key === "z") && historyIndex < history.length - 1) { historyIndex++; messageInput.value = history[historyIndex]; e.preventDefault(); }
        updateSendButtonColor({ attachments: currentAttachments });
    });
    messageInput.addEventListener("keydown", async (e) => {
        if (e.ctrlKey && e.key === 'c' && messageInput.selectionStart === messageInput.selectionEnd) {
            e.preventDefault(); try { await navigator.clipboard.writeText(''); } catch (err) { console.error(`[ERROR] ${err}`); }
            updateSendButtonColor({ attachments: currentAttachments });
        }
    });
    $("message-input").addEventListener("keydown", (e) => {
        const isCurrentlyMobile = window.innerWidth < 768;
        if (isCurrentlyMobile) {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault();
                const start = messageInput.selectionStart, end = messageInput.selectionEnd;
                messageInput.value = messageInput.value.substring(0, start) + "\n" + messageInput.value.substring(end);
                messageInput.selectionStart = messageInput.selectionEnd = start + 1;
            }
        } else {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); sendMessage(); autoComplete.hide(); updateSendButtonColor({ attachments: currentAttachments });
            }
        }
    });
    document.addEventListener("keydown", (e) => {
        const activeEl = document.activeElement, settingsPanel = $("settings-panel");
        if (settingsPanel && settingsPanel.style.display === "flex") return;
        if (activeEl && activeEl.classList.contains("edit-box")) return;
        if (["INPUT", "TEXTAREA"].includes(activeEl.tagName)) return; 
        if (e.key === "Enter") { e.preventDefault(); messageInput.focus(); messageInput.value += "\n"; }

        if (e.ctrlKey && e.shiftKey && e.key === KEYBIND_OPEN_SETTINGS) { openSettingsPanel(); e.preventDefault(); }
        updateSendButtonColor();
        if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {messageInput.focus();}
    });
    document.addEventListener("paste", async (e) => {
        if (settingsPanel && settingsPanel.style.display === "flex") return;
        messageInput.focus();
    });
    const dropOverlay = document.createElement("div"); dropOverlay.className = "drop-overlay"; dropOverlay.innerHTML = `<div class="drop-content"><img src="./assets/svg/file/Upload a File.svg"><span>Drag files here to upload them into SparkleCord</span></div>`;
    $("app").appendChild(dropOverlay);
    $("app").addEventListener("dragenter", (e) => { if (e.dataTransfer.types.includes('Files')) dropOverlay.classList.add("active"); });
    $("app").addEventListener("dragleave", (e) => { if (!e.relatedTarget || !$("app").contains(e.relatedTarget)) dropOverlay.classList.remove("active"); });
    $("app").addEventListener("dragover", (e) => { e.preventDefault(); e.stopPropagation(); });
    $("app").addEventListener("drop", (e) => { e.preventDefault(); e.stopPropagation(); dropOverlay.classList.remove("active");
        const files = [...e.dataTransfer.files]; if (!files.length) return; files.forEach(createAttachmentPreview);
    });
    $("app").addEventListener("paste", (e) => { const files = [...e.clipboardData.files]; if (!files.length) return; files.forEach(createAttachmentPreview); });
    updateSendButtonColor();
    function closeReply() {
        R_INDICATOR.style.display = "none";
        document.querySelectorAll(".message").forEach(function(msg) { 
            msg.classList.remove("replying");
            if (msg.parentElement?.matches(".reply-thread")) {
                msg.parentElement.classList.remove("replying");
            }
        });
        messageInput.removeAttribute("data-replying-to");
    }
    $("close-reply").addEventListener("click", closeReply);
    document.addEventListener("keydown", function(event) {
        if (event.key === KEYBIND_CLOSE && R_INDICATOR.style.display === "flex") { closeReply(); }
    });
});

window.handleEmojiError = function(img, original, code) {
    emojiUtils.handleEmojiError(img, original, code);
};
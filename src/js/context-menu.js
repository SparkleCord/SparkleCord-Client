class MessageActivities {
    constructor() {
        this.lastMessage = null;
        this.contextMenuItems = [
            // { id: "react-msg", label: "Add Reaction", action: (msg) => this.reactTo(msg, reaction), icon: `./assets/svg/ctx/React.svg` },
            { id: "edit-msg", label: "Edit Message", action: (msg) => this.editMessage(msg), icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="m13.96 5.46 4.58 4.58a1 1 0 0 0 1.42 0l1.38-1.38a2 2 0 0 0 0-2.82l-3.18-3.18a2 2 0 0 0-2.82 0l-1.38 1.38a1 1 0 0 0 0 1.42ZM2.11 20.16l.73-4.22a3 3 0 0 1 .83-1.61l7.87-7.87a1 1 0 0 1 1.42 0l4.58 4.58a1 1 0 0 1 0 1.42l-7.87 7.87a3 3 0 0 1-1.6.83l-4.23.73a1.5 1.5 0 0 1-1.73-1.73Z"></path></svg>`, selfOnly: true },
            { id: "reply-msg", label: "Reply", action: (msg) => this.replyTo(msg), icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M2.3 7.3a1 1 0 0 0 0 1.4l5 5a1 1 0 0 0 1.4-1.4L5.42 9H11a7 7 0 0 1 7 7v4a1 1 0 1 0 2 0v-4a9 9 0 0 0-9-9H5.41l3.3-3.3a1 1 0 0 0-1.42-1.4l-5 5Z"></path></svg>` },
            { id: "copy-msg", label: "Copy Text", action: (msg) => this.copyMessage(msg), icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 16a1 1 0 0 1-1-1v-5a8 8 0 0 1 8-8h5a1 1 0 0 1 1 1v.5a.5.5 0 0 1-.5.5H10a6 6 0 0 0-6 6v5.5a.5.5 0 0 1-.5.5H3Z"/><path fill="currentColor" d="M6 18a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-4h-3a5 5 0 0 1-5-5V6h-4a4 4 0 0 0-4 4v8Z"/><path fill="currentColor" d="M21.73 12a3 3 0 0 0-.6-.88l-4.25-4.24a3 3 0 0 0-.88-.61V9a3 3 0 0 0 3 3h2.73Z"/></svg>` },
            { id: "speak-msg", label: "Speak Message", action: m => speak(m.getAttribute("data-author") + " said " + m.getAttribute("data-content")), icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 22a10 10 0 1 0-8.45-4.64c.13.19.11.44-.04.61l-2.06 2.37A1 1 0 0 0 2.2 22H12Zm2-5.26c0 .61.56 1.09 1.14.87a6 6 0 0 0 0-11.22c-.58-.22-1.14.26-1.14.87v.1c0 .45.32.83.73 1.03a4 4 0 0 1 0 7.22c-.41.2-.73.58-.73 1.04v.09Zm0-3.32c0 .69.7 1.15 1.18.65a2.99 2.99 0 0 0 0-4.14c-.48-.5-1.18-.04-1.18.65v2.84ZM12 7a1 1 0 0 0-1-1h-.05a1 1 0 0 0-.75.34L7.87 9H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1.87l2.33 2.66a1 1 0 0 0 .75.34H11a1 1 0 0 0 1-1V7Z"/></svg>` },
            // { id: "copy-inner-html", label: "Copy HTML", action: (msg) => this.copyHTML(msg), icon: `./assets/svg/ctx/Copy.svg` },
            { id: "delete-msg", label: "Delete Message", action: (msg) => this.deleteMessage(msg), destructive: true, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M14.25 1c.41 0 .75.34.75.75V3h5.25c.41 0 .75.34.75.75v.5c0 .41-.34.75-.75.75H3.75A.75.75 0 0 1 3 4.25v-.5c0-.41.34-.75.75-.75H9V1.75c0-.41.34-.75.75-.75h4.5Z"></path><path fill="currentColor" fill-rule="evenodd" d="M5.06 7a1 1 0 0 0-1 1.06l.76 12.13a3 3 0 0 0 3 2.81h8.36a3 3 0 0 0 3-2.81l.75-12.13a1 1 0 0 0-1-1.06H5.07ZM11 12a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0v-6Zm3-1a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Z" clip-rule="evenodd"></path></svg>`, selfOnly: true },
            { id: "copy-id", label: "Copy Message ID", action: (msg) => this.copyID(msg), destructive: false, icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"> <path fill="currentColor" d="M15.3 14.48c-.46.45-1.08.67-1.86.67h-1.39V9.2h1.39c.78 0 1.4.22 1.86.67.46.45.68 1.22.68 2.31 0 1.1-.22 1.86-.68 2.31Z"/> <path fill="currentColor" fill-rule="evenodd" d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm1 15h2.04V7.34H6V17Zm4-9.66V17h3.44c1.46 0 2.6-.42 3.38-1.25.8-.83 1.2-2.02 1.2-3.58s-.4-2.75-1.2-3.58c-.79-.83-1.92-1.25-3.38-1.25H10Z" clip-rule="evenodd"/> </svg>` },
        ];
        this.init();
    }
    init() {
        this.contextMenu = document.createElement("div");
        this.contextMenu.id = "context-menu";
        this.contextMenuItems.forEach(({ id, label, action, destructive, icon, selfOnly }) => {
            const menuItem = document.createElement("div"); menuItem.className = `menu-item${destructive ? " danger" : ""}`; menuItem.id = id;
            const wrapper = document.createElement("div"); wrapper.className = "menu-item-content";
            const labelSpan = document.createElement("span"); labelSpan.textContent = label; wrapper.appendChild(labelSpan);
            if (icon) {
                const iconSpan = document.createElement("span"); iconSpan.className = "menu-item-icon";
                if (icon.startsWith('<svg')) { iconSpan.innerHTML = icon; } else if (icon.match(/\.(svg)$/i)) {
                    console.error("PLEASE use inline SVG! SVG files are no longer supported for context/hover menus.")
                }
                wrapper.appendChild(iconSpan);
            }
            if (selfOnly) {
                menuItem.setAttribute("data-self", "true")
            }
            menuItem.appendChild(wrapper);
            menuItem.addEventListener("click", () => {
                action(this.lastMessage);
                setTimeout(() => this.contextMenu.classList.remove("show"), 50);
            });
            this.contextMenu.appendChild(menuItem);
        });
        document.addEventListener("DOMContentLoaded", () => {
            document.body.appendChild(this.contextMenu);
            const messagesContainer = $("messages");
            messagesContainer.addEventListener("click", (e) => {
                if (e.target.classList.contains("message-content")) this.lastMessage = e.target.closest(".message");
            });
            messagesContainer.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                if (e.target.closest(".edit-box") || (e.target.closest("button") && e.isSynthetic !== true)) return;
                const message = e.target.closest(".message");
                if (!message || message.querySelector(".eyecon")) return;
                this.lastMessage = message;
                showContextMenu(message, e);
            });
            document.addEventListener("click", (e) => {
                if (!e.isSynthetic && !e.target.closest("#context-menu") && !e.target.closest("#hover-more")) { this.contextMenu.classList.remove("show"); }
            });
            document.body.addEventListener("click", (e) => {
                if (e.target.classList.contains("menu-item")) { setTimeout(() => this.contextMenu.classList.remove("show"), 50); }
            });
            document.addEventListener("keydown", (e) => {
                const activeEl = document.activeElement;
                if (activeEl && activeEl.classList.contains("edit-box")) return;
                if (settingsPanel && settingsPanel.contains(document.activeElement)) return;
                if (activeEl.isContentEditable || ["INPUT", "TEXTAREA"].includes(activeEl.tagName)) return;
                if (e.key === KEYBIND_EDIT) {
                    if (settingsPanel && settingsPanel.contains(document.activeElement)) return;
                    e.preventDefault(); this.editMessage([...document.querySelectorAll("#messages .message[data-userid='" + humans.self.id + "']")].at(-1))
                }
            });
        })
    }
    // Operation Functions
    deleteMessage(msg) {
        const messageGroup = msg.closest(".message-group");
        if (!messageGroup) return;
        const isFirst = msg === messageGroup.firstElementChild;

        eventBus.emit("msgDelete", {
            message: msg,
            timestamp: Date.now(),
        });

        msg.remove();
        if (messageGroup.children.length === 0) return messageGroup.remove();
        if (isFirst) {
            const newFirst = messageGroup.firstElementChild;
            newFirst.classList.remove("grouped");
            const avatar = humans.self.avatar;
            const author = humans.self.name;
            const timestamp = newFirst.getAttribute("data-timestamp");
            const content = newFirst.querySelector(".content").innerHTML;
            newFirst.innerHTML = `
                <img class="profile-pic" src="${avatar}">
                <div class="message-background">
                    <div class="message-content">
                        <div class="author">${author} <span class="timestamp">${formatTimestamp(timestamp)}</span></div>
                        <div class="content">${content}</div>
                    </div>
                </div>
            `;
            this.lastMessageTimestamp = timestamp;
            this.lastMessageAuthor = author;
            this.lastMessageAvatar = avatar;
        }
    }
    editMessage(msg) {
        const contentElement = msg.querySelector(".content");
        const content = msg.getAttribute("data-content");
        if (!content) return;
        const container = document.createElement("div"); container.className = "edit-container";
        const input = document.createElement("textarea"); input.id = "edit-box"; input.value = content;
        const editOps = document.createElement("div"); editOps.className = "editOperations";
        const cancelButton = document.createElement("a"); cancelButton.className = "link"; cancelButton.role = "button"; cancelButton.textContent = "cancel";
        cancelButton.style.cursor = "pointer";
        const saveButton = document.createElement("a"); saveButton.className = "link"; saveButton.role = "button"; saveButton.textContent = "save";
        saveButton.style.cursor = "pointer";
        editOps.appendChild(document.createTextNode("escape to ")); editOps.appendChild(cancelButton);
        editOps.appendChild(document.createTextNode(" • enter to ")); editOps.appendChild(saveButton);
        container.appendChild(input); container.appendChild(editOps);
        const parent = contentElement.parentNode;
        const activeEdit = document.querySelector(".edit-box");
        if (activeEdit) activeEdit.closest(".edit-container")?.querySelector(".link")?.click();
        parent.replaceChild(container, contentElement);
        input.focus();

        const saveEdit = () => {
            const originalMessage = msg;
            input.removeEventListener("blur", cancelEdit);
            const newTextTemp = input.value.trim();
            const newText = sanitizeInput(newTextTemp);
            if (!newText) { msg.remove(); return; }
            const wasEdited = contentElement.querySelector(".edited-tag");
            parent.replaceChild(contentElement, container);
            const formattedText = getMentions(newText);
            contentElement.innerHTML = parseMarkdown(convertEmoticons(formattedText));
            msg.setAttribute("data-content", newTextTemp);
            applyHighlighting(msg);
            let hasMentions = checkMentions(formattedText);
            if (hasMentions) msg.classList.add("mention");
            if (wasEdited || (newTextTemp !== content && !contentElement.innerHTML.includes(" (edited)"))) {
                const tag = document.createElement("span");
                tag.className = "edited-tag";
                tag.textContent = " (edited)";
                contentElement.appendChild(tag);
            }
            eventBus.emit("msgEdit", {
                msgBefore: originalMessage,
                msgAfter: msg,
                timestamp: Date.now()
            });
        };
        const cancelEdit = () => { if (container.parentNode === parent) { parent.replaceChild(contentElement, container); } };
        cancelButton.addEventListener("click", (e) => { e.preventDefault(); cancelEdit(); });
        saveButton.addEventListener("click", (e) => { e.preventDefault(); saveEdit(); });
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveEdit(); }
            if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
            e.stopPropagation();
        });
    }
    copyMessage(msg) {
        const messageContent = msg.getAttribute("data-content");
        navigator.clipboard.writeText(messageContent);
        console.log(`Copied successfully! (Today at ${new Date(new Date().toISOString()).toLocaleTimeString([])})`);
    }
    copyHTML(msg) {
        let messageContent = msg.classList.contains('grouped') ? msg.innerHTML : msg.querySelector('.message-content').innerHTML;
        messageContent = messageContent.replace(/data:([^;]+);base64,([^"'\s>]+)/g, (match, mimeType, base64) => `data:${mimeType};base64,${base64.substring(0, 20)}...`);
        navigator.clipboard.writeText(messageContent);
        console.log(`Copied HTML successfully! (Today at ${new Date(new Date().toISOString()).toLocaleTimeString([])})`);
    }
    replyTo(msg) {
        const au = msg.getAttribute("data-author"), id = msg.getAttribute("data-id"), c = msg.getAttribute("data-color"), inp = $("input-box");
        inp.focus(); inp.setAttribute("data-replying-to", id); inp.setAttribute("data-pstate", "true");

        const messages = document.querySelectorAll(".message");
        messages.forEach(message => {
            if (message.getAttribute("data-id") !== inp.getAttribute("data-replying-to")) {
                message.classList.remove("replying");
                if (message.parentElement?.matches(".reply-thread")) message.parentElement.classList.remove("replying");
            }
        });

        if (humans.self.name === au) {
            toggleReplyPing("off");
        }

        $("reply-target").innerHTML = `Replying to <span style="color: ${c}; font-weight: 600;">${au}</span>`;
        R_INDICATOR.style.display = "flex";

        msg.classList.add("replying");
        if (msg.parentElement?.matches(".reply-thread")) {
            msg.parentElement.classList.add("replying");
            msg.classList.remove("replying");
        }

        R_INDICATOR.setAttribute("onclick", () => { jumpToMsg(msg.id); });
    }
    reactTo(msg) {
        // Add an emoji variable which includes a unicode emoji in 16x16 size [it converts it to an svg similar to emoji handling.]
        console.log(`@${humans.self.name}: \'${msg.getAttribute("data-content")}\,`)
        console.log(`${msg.getAttribute("data-content")}`)
    }
    copyID(msg) {
        const messageID = msg.getAttribute("data-id");
        navigator.clipboard.writeText(messageID);
        console.log(`Copied ID successfully! (Today at ${new Date(new Date().toISOString()).toLocaleTimeString([])})`);
    }
}
function showContextMenu(msg, e) {
    if (!msg || msg.querySelector(".edit-box")) return;
    const menu = $("context-menu"); if (!menu) return;

    const items = menu.querySelectorAll(".menu-item");
    items.forEach(item => {
        if (item.getAttribute("data-self") === "true") {
            if (humans.self.id.toString() !== msg.getAttribute("data-userid")) { item.style.display = "none"; } else { item.removeAttribute("style"); }
        }
    });

    menu.style.visibility = "hidden"; menu.classList.add("show");
    let x = e.clientX, y = e.clientY;
    if (e.isSynthetic) { y += 8; x -= 10; }
    const menuRect = menu.getBoundingClientRect();
    if (x + menuRect.width > window.innerWidth) x = window.innerWidth - menuRect.width;
    if (y + menuRect.height > window.innerHeight) y = window.innerHeight - menuRect.height;
    x = Math.max(0, x); y = Math.max(0, y);
    menu.style.left = `${x}px`; menu.style.top = `${y}px`; menu.style.visibility = "visible";

    eventBus.emit("msgContextMenu", {
        message: msg,
        timestamp: Date.now(),
        event: e
    });
}
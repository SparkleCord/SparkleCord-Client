class MessageActivities {
    constructor() {
        this.lastMessage = null;
        this.contextMenuItems = [
            { 
                id: "react-msg",
                label: "Add Reaction",
                action: (msg) => this.reactTo(msg, reaction),
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22ZM6.5 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-9.8 1.17a1 1 0 0 1 1.39.27 3.5 3.5 0 0 0 5.82 0 1 1 0 0 1 1.66 1.12 5.5 5.5 0 0 1-9.14 0 1 1 0 0 1 .27-1.4Z" clip-rule="evenodd" class=""></path></svg>`
            },
            { 
                id: "edit-msg",
                label: "Edit Message",
                action: (msg) => this.editMessage(msg),
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="m13.96 5.46 4.58 4.58a1 1 0 0 0 1.42 0l1.38-1.38a2 2 0 0 0 0-2.82l-3.18-3.18a2 2 0 0 0-2.82 0l-1.38 1.38a1 1 0 0 0 0 1.42ZM2.11 20.16l.73-4.22a3 3 0 0 1 .83-1.61l7.87-7.87a1 1 0 0 1 1.42 0l4.58 4.58a1 1 0 0 1 0 1.42l-7.87 7.87a3 3 0 0 1-1.6.83l-4.23.73a1.5 1.5 0 0 1-1.73-1.73Z"></path></svg>`,
                selfOnly: true
            },
            { 
                id: "reply-msg",
                label: "Reply",
                action: (msg) => this.replyTo(msg),
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M2.3 7.3a1 1 0 0 0 0 1.4l5 5a1 1 0 0 0 1.4-1.4L5.42 9H11a7 7 0 0 1 7 7v4a1 1 0 1 0 2 0v-4a9 9 0 0 0-9-9H5.41l3.3-3.3a1 1 0 0 0-1.42-1.4l-5 5Z"></path></svg>`
            },
            // FORWARD (missing)
            // CREATE THREAD (missing)
            { 
                id: "copy-msg",
                label: "Copy Text",
                action: (msg) => this.copyMessage(msg),
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 16a1 1 0 0 1-1-1v-5a8 8 0 0 1 8-8h5a1 1 0 0 1 1 1v.5a.5.5 0 0 1-.5.5H10a6 6 0 0 0-6 6v5.5a.5.5 0 0 1-.5.5H3Z"/><path fill="currentColor" d="M6 18a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-4h-3a5 5 0 0 1-5-5V6h-4a4 4 0 0 0-4 4v8Z"/><path fill="currentColor" d="M21.73 12a3 3 0 0 0-.6-.88l-4.25-4.24a3 3 0 0 0-.88-.61V9a3 3 0 0 0 3 3h2.73Z"/></svg>`
            },
            // PIN MESSAGE (missing)
            // APPS (missing)
              // > icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9.3 5.3a1 1 0 0 0 0 1.4l5.29 5.3-5.3 5.3a1 1 0 1 0 1.42 1.4l6-6a1 1 0 0 0 0-1.4l-6-6a1 1 0 0 0-1.42 0Z"></path></svg>
            { 
                id: "unread-msg",
                label: "Mark Unread", 
                action: (msg) => this.markUnread(msg),
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.93 21.96c.25-.03.43-.23.47-.47a3 3 0 0 1 .08-.35.66.66 0 0 0-.24-.71A3 3 0 0 1 12 18v-3a3 3 0 0 1 4.35-2.68c.14.07.3.09.44.04a7 7 0 0 1 4.58.05c.3.1.63-.1.63-.41a10 10 0 1 0-18.45 5.36c.13.19.11.44-.04.61l-2.06 2.37A1 1 0 0 0 2.2 22H12c.32 0 .63-.01.93-.04Z" fill="currentColor"></path><path d="M18 17h-1.24a3 3 0 1 1 .26 4.25 1 1 0 1 0-1.33 1.5A4.98 4.98 0 0 0 24 19a5 5 0 0 0-8-4 1 1 0 0 0-2 0v3a1 1 0 0 0 1 1h3a1 1 0 1 0 0-2Z" fill="currentColor"></path></svg>`
            },
            // COPY MESSAGE LINK (missing)
            { 
                id: "speak-msg",
                label: "Speak Message",
                action: (msg) => speak(`${msg.getAttribute("data-author")} said ${msg.getAttribute("data-content")}`),
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 22a10 10 0 1 0-8.45-4.64c.13.19.11.44-.04.61l-2.06 2.37A1 1 0 0 0 2.2 22H12Zm2-5.26c0 .61.56 1.09 1.14.87a6 6 0 0 0 0-11.22c-.58-.22-1.14.26-1.14.87v.1c0 .45.32.83.73 1.03a4 4 0 0 1 0 7.22c-.41.2-.73.58-.73 1.04v.09Zm0-3.32c0 .69.7 1.15 1.18.65a2.99 2.99 0 0 0 0-4.14c-.48-.5-1.18-.04-1.18.65v2.84ZM12 7a1 1 0 0 0-1-1h-.05a1 1 0 0 0-.75.34L7.87 9H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1.87l2.33 2.66a1 1 0 0 0 .75.34H11a1 1 0 0 0 1-1V7Z"/></svg>`
            },
            /* { 
                id: "copy-inner-html",
                label: "Copy HTML Code",
                action: (msg) => this.copyHTML(msg),
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 16a1 1 0 0 1-1-1v-5a8 8 0 0 1 8-8h5a1 1 0 0 1 1 1v.5a.5.5 0 0 1-.5.5H10a6 6 0 0 0-6 6v5.5a.5.5 0 0 1-.5.5H3Z"/><path fill="currentColor" d="M6 18a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-4h-3a5 5 0 0 1-5-5V6h-4a4 4 0 0 0-4 4v8Z"/><path fill="currentColor" d="M21.73 12a3 3 0 0 0-.6-.88l-4.25-4.24a3 3 0 0 0-.88-.61V9a3 3 0 0 0 3 3h2.73Z"/></svg>`
            }, */
            { 
                id: "delete-msg",
                label: "Delete Message",
                action: (msg) => this.deleteMessage(msg),
                destructive: true,
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M14.25 1c.41 0 .75.34.75.75V3h5.25c.41 0 .75.34.75.75v.5c0 .41-.34.75-.75.75H3.75A.75.75 0 0 1 3 4.25v-.5c0-.41.34-.75.75-.75H9V1.75c0-.41.34-.75.75-.75h4.5Z"></path><path fill="currentColor" fill-rule="evenodd" d="M5.06 7a1 1 0 0 0-1 1.06l.76 12.13a3 3 0 0 0 3 2.81h8.36a3 3 0 0 0 3-2.81l.75-12.13a1 1 0 0 0-1-1.06H5.07ZM11 12a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0v-6Zm3-1a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Z" clip-rule="evenodd"></path></svg>`, 
                selfOnly: true
            },
            { 
                id: "copy-id",
                label: "Copy Message ID",
                action: (msg) => this.copyID(msg),
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"> <path fill="currentColor" d="M15.3 14.48c-.46.45-1.08.67-1.86.67h-1.39V9.2h1.39c.78 0 1.4.22 1.86.67.46.45.68 1.22.68 2.31 0 1.1-.22 1.86-.68 2.31Z"/> <path fill="currentColor" fill-rule="evenodd" d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm1 15h2.04V7.34H6V17Zm4-9.66V17h3.44c1.46 0 2.6-.42 3.38-1.25.8-.83 1.2-2.02 1.2-3.58s-.4-2.75-1.2-3.58c-.79-.83-1.92-1.25-3.38-1.25H10Z" clip-rule="evenodd"/> </svg>`
            },
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
                if (icon.startsWith("<svg")) { iconSpan.innerHTML = icon; } else if (icon.match(/\.(svg)$/i)) {
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
            const messagesContainer = $("#messages");
            messagesContainer.addEventListener("click", (e) => {
                if (e.target.classList.contains("message-content")) this.lastMessage = e.target.closest(".message");
            });
            messagesContainer.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                if (e.target.closest("#edit-box") || (e.target.closest("button") && e.isSynthetic !== true)) return;
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
                    e.preventDefault(); this.editMessage([...document.querySelectorAll(`#messages .message[data-userid='${humans.self.id}']`)].at(-1))
                }
            });
        })
    }
    
    // context menu items
    deleteMessage(msg) {
        const messageGroup = msg.closest(".message-group");
        if (!messageGroup) return;
        const isFirst = msg === messageGroup.firstElementChild;

        const data = { pfp: null, author: null };
        if (isFirst) {
            data.pfp = msg.querySelector("img.profile-pic").outerHTML;
            data.author = msg.querySelector(".author").innerHTML;
        }

        eventBus.emit("msgDelete", {
            message: msg,
            timestamp: Date.now(),
        });

        msg.remove();
        if (messageGroup.children.length === 0) return messageGroup.remove();
        
        if (isFirst) {
            const newFirst = messageGroup.firstElementChild;
            newFirst.classList.remove("grouped");

            newFirst.innerHTML = `
                ${data.pfp}
                <div class="message-background">
                    <div class="message-content">
                        <div class="author">${data.author}</div>
                        <div class="content">${newFirst.querySelector(".content").innerHTML}</div>
                    </div>
                </div>
            `;

            window.hoverButtons.addHoverButtons(newFirst);
        }
    }

    editMessage(msg) {
        // initialization
        const contentElement = msg.querySelector(".content"), content = msg.getAttribute("data-content");
        const parent = contentElement.parentNode;

        if (!content) return;

        // create the box
        const container = el("div", { className: "edit-container" });
        const input = el("textarea", { id: "edit-box", value: content.replace(/^@g/, "") });
        const cancelButton = el("a", { className: "link", role: "button", textContent: "cancel" });
        const saveButton = el("a", { className: "link", role: "button", textContent: "save" });
        const editOps = el("div", { 
            className: "editOperations",
            innerHTML: `escape to ${cancelButton.outerHTML} • enter to ${saveButton.outerHTML}`
        });

        // append the box and initialize editing environment
        container.appendChild(input);
        container.appendChild(editOps);

        document.querySelector("#edit-box")?.closest(".edit-container")?.querySelector(".link")?.click();

        parent.replaceChild(container, contentElement);
        input.focus();

        // attach the functions
        editOps.querySelectorAll("a").forEach((btn, i) => btn.onclick = (e) => { e.preventDefault(); [cancelEdit, saveEdit][i](); });

        // helper functions
        function saveEdit() {
            const originalMessage = msg;

            // setup the saving environment
            const newTextTemp = Parser.trim(input.value), newText = sanitizeInput(newTextTemp);
            if (!newText) { msg.remove(); return; }
            parent.replaceChild(contentElement, container);

            // formatting
            const formattedText = getMentions(newText);
            contentElement.innerHTML = parseMarkdown(convertEmoticons(formattedText));
            msg.setAttribute("data-content", newTextTemp);
            applyHighlighting(msg);
            if (checkMentions(formattedText)) msg.classList.add("mention");

            // add (edited)
            if (content !== newTextTemp) {
                const tag = el("span", { className: "edited-tag", textContent: " (edited)", title: formatTime(Date.now(), "F") });
                contentElement.appendChild(tag);
            }

            // emit the event because PLUGINS ARE AWESOMEEEEE
            eventBus.emit("msgEdit", {
                msgBefore: originalMessage,
                msgAfter: msg,
                timestamp: Date.now()
            });
        };

        function cancelEdit() {
            if (container.parentNode === parent) parent.replaceChild(contentElement, container);
        }

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.stopImmediatePropagation(); saveEdit(); }
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
        let messageContent = msg.classList.contains("grouped") ? msg.innerHTML : msg.querySelector(".message-content").innerHTML;
        messageContent = messageContent.replace(/data:([^;]+);base64,([^"'\s>]+)/g, (match, mimeType, base64) => `data:${mimeType};base64,${base64.substring(0, 20)}...`);
        navigator.clipboard.writeText(messageContent);
        console.log(`Copied HTML successfully! (Today at ${new Date(new Date().toISOString()).toLocaleTimeString([])})`);
    }

    replyTo(msg) {
        const au = msg.getAttribute("data-author"), id = msg.getAttribute("data-id"), c = msg.getAttribute("data-color"), inp = $("#input-box");
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

        $("#reply-target").innerHTML = `Replying to <span style="color: ${c}; font-weight: 600;">${au}</span>`;
        R_INDICATOR.style.display = "flex";

        msg.classList.add("replying");
        if (msg.parentElement?.matches(".reply-thread")) {
            msg.parentElement.classList.add("replying");
            msg.classList.remove("replying");
        }

        R_INDICATOR.setAttribute("onclick", () => { jumpToMsg(msg.id); });
    }

    reactTo(msg) {
        const container = msg.querySelector(".reaction-container");
        container.innerHTML = `${container.innerHTML}${getReactionHTML({ emoji: prompt("what emoji to use?").slice(0, 100), type: "regular", reacted: true, count: 1 })}`;
    }

    markUnread(msg) {
        $(".divider.unread", true).forEach(d => d.remove());

        const divider = el("div", { className: "divider unread", innerHTML: `<span class="divider-span unread"><svg aria-hidden="true" role="img" width="8" height="13" viewBox="0 0 8 13" class="divider-endCap unread"><path class="divider-endCapStroke unread" stroke="currentColor" fill="transparent" d="M8.16639 0.5H9C10.933 0.5 12.5 2.067 12.5 4V9C12.5 10.933 10.933 12.5 9 12.5H8.16639C7.23921 12.5 6.34992 12.1321 5.69373 11.4771L0.707739 6.5L5.69373 1.52292C6.34992 0.86789 7.23921 0.5 8.16639 0.5Z"></path></svg>new</span>` });

        msg.before(divider);

        const msgs = [...$(".message", true)];
        console.log(`${msgs.slice(msgs.indexOf(msg)).length - 1} new messages since ${$(".timestamp", false, msg).textContent}`);
    }

    copyID(msg) {
        navigator.clipboard.writeText(msg.getAttribute("data-id"));
        console.log(`Copied ID successfully! (Today at ${new Date(new Date().toISOString()).toLocaleTimeString([])})`);
    }

}
function showContextMenu(msg, e) {
    if (!msg || msg.querySelector("#edit-box")) return;
    const menu = $("#context-menu"); if (!menu) return;

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
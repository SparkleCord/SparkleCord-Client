function flagAsEdited(msg, newText) {
    const contentElement = msg.querySelector(".content"), contentAttr = msg.getAttribute("data-content"), text = sanitizeInput(newText);
    let hasMentions = mentionPattern.test(text);
    const wasEdited = contentElement.querySelector(".edited-tag");
    const formattedText = newText.replace(mentionPattern, (_, mention) =>
        `<span class="ping">@${mention.toLowerCase() === profile.name.toLowerCase() ? profile.name : mention.toLowerCase()}</span>`);
    contentElement.innerHTML = parseMarkdown(convertEmoticons(formattedText));
    msg.setAttribute("data-content", newText);
    applyHighlighting(msg);
    if (hasMentions) msg.classList.add("mention");
    if ((wasEdited && wasEdited.textContent === " (edited)") || (newText !== contentAttr && !contentElement.innerHTML.includes(" (edited)"))) {
        const tag = document.createElement("span"); tag.className = "edited-tag"; tag.textContent = " (edited)"; contentElement.appendChild(tag);
    }
};

async function sendMessage() {
    const messageInput = document.getElementById("input-box"), content = messageInput.value.trim(), hasAttachments = currentAttachments.length > 0;
    if (!content && !hasAttachments) return;
    let convertedContent = convertEmoticons(sanitizeInput(content));
    if (content.startsWith("/")) {
        const commandMatch = content.match(/^\/(\w+)(?:\s(.*))?$/);
        if (commandMatch) {
            const commandName = commandMatch[1].toLowerCase(), commandArgs = commandMatch[2] || "", command = commands.find(cmd => cmd.name === commandName);
            if (command) {
                if (command.modifyMessage) convertedContent = command.modifyMessage(commandArgs);
                else { command.execute(commandArgs); messageInput.value = ""; history.push(""); historyIndex = history.length - 1; updateSendButtonColor(); return; }
            }
        }
    }

    // Flags
    let FLAG_startNewGroup = false;
    if (content.startsWith("@g")) {
        convertedContent = content.replace("@g", "")
        FLAG_startNewGroup = true;
    }
    // End of flags

    if (content.match(/s\/([^\/]+)\/([^\/]+)/)) {
        let match = content.match(/s\/([^\/]+)\/([^\/]+)/), textToReplace = match[1], replacement = match[2];
        const lastMsg = [...document.querySelectorAll("#messages .message[data-userid='" + profile.id + "']")].at(-1);
        if (lastMsg) {
            let text = lastMsg.querySelector(".content").innerHTML;
            text = text.replace(new RegExp(textToReplace, "i"), replacement);
            flagAsEdited(lastMsg, text)
            messageInput.value = ""; history.push(""); historyIndex = history.length - 1; updateSendButtonColor(); return;
        }
    }
    const timestamp = new Date().toISOString();

    const data = {
        username: profile.username, name: profile.name, content: convertedContent, avatar: profile.avatar, attachments: [], userid: profile.id, color: "var(--header-primary)"
    };
    data.id = generateSnowflake(Date.now()).toString();

    if (hasAttachments) {
        for (const attachment of currentAttachments) {
            const fileContent = await processFileForMessage(attachment);
            data.attachments.push({ id: attachment.id, name: attachment.name, type: attachment.type, size: formatFileSize(attachment.size), content: fileContent });
        }
    }

    let formattedContent = "", hasMentions = false, hasReplyMentions = false;
    if (content) {
        hasMentions = mentionPattern.test(content); mentionPattern.lastIndex = 0;
        formattedContent = convertedContent.replace(mentionPattern, (_, mention) => `<span class="ping">@${mention.toLowerCase() === profile.name.toLowerCase() ? profile.name : mention.toLowerCase()}</span>`);
        formattedContent = parseMarkdown(formattedContent);
    }
    let messageHTML = formattedContent ? `<div class="content">${formattedContent}</div>` : "";
    if (hasAttachments) {
        messageHTML += `<div class="attachments">`;
        for (const attachment of data.attachments) {
            if (attachment.type.startsWith("image/")) messageHTML += `<div class="attachment media"><img src="${attachment.content}" alt="Image"></div>`;
            else if (attachment.type.startsWith("video/")) messageHTML += `<div class="attachment media-video"><video controls src="${attachment.content}"></video></div>`;
            else if (attachment.type.startsWith("audio/")) messageHTML += `<div class="attachment media-audio"><img class="file-icon" src="${getFileIcon(attachment.type)}"><audio controls src="${attachment.content}"></audio><a href="${attachment.content}" class="link" target="_blank">${attachment.name}</a><span class="file-size">${attachment.size}</span></div>`;
            else messageHTML += `<div class="attachment file-other"><img class="file-icon" src="${getFileIcon(attachment.type)}"><a href="${attachment.content}" class="link" target="_blank">${attachment.name}</a><span class="file-size">${attachment.size}</span></div>`;
        }
        messageHTML += `</div>`;
    }

    // REPLIES
    const replyToID = document.getElementById("input-box").getAttribute("data-replying-to");
    let replyHTML = ``;
    if (replyToID) {
        const repliedMsg = document.getElementById(replyToID);

        repliedMsg.classList.remove("replying");
        if (repliedMsg.parentElement?.matches(".reply-thread")) repliedMsg.parentElement.classList.remove("replying");

        if (repliedMsg) {
            const replyAuthor = repliedMsg.getAttribute("data-author") || "";
            let replyContent = repliedMsg.getAttribute("data-content");
            let replyPFP = repliedMsg.getAttribute("data-avatar") || profile.defaultAvatar;
            const replyColor = repliedMsg.getAttribute("data-color");
            const mention = $("input-box").getAttribute("data-pstate") === "true" ? `@` : ``;
            const hasAttachments = repliedMsg.getAttribute("data-hasAttachments") || false;
            const nametag = repliedMsg.getAttribute("data-nametag");
            let useEmptyPFPAndNoName = false;
            console.log("Use empty profile picture and no name:", useEmptyPFPAndNoName);

            if (!replyContent && !hasAttachments) {
                useEmptyPFPAndNoName = true;
                replyContent = "*Message could not be loaded*";
            } else {
                useEmptyPFPAndNoName = false;
            }      

            console.log("replyContent:", replyContent);
            console.log("hasAttachments:", hasAttachments);
            console.log("replyAuthor:", replyAuthor);
            console.log("Use empty profile picture and no name:", useEmptyPFPAndNoName);
            replyHTML = `
            <div class="reply-container">
                ${ !useEmptyPFPAndNoName
                    ? `<img src="${replyPFP}">\n ${nametag ? nametag : ''}<span class="reply-author" style="color: ${replyColor};">${mention}${replyAuthor}</span>` 
                    : replySVG
                }
                <span class="reply-content">
                    ${hasAttachments ? parseReplyMarkdown(replyContent || "*Click to see attachment*") + attachmentSVG : parseReplyMarkdown(replyContent)}
                </span>
            </div>`;
            console.log("replyHTML:", replyHTML);
            if (replyAuthor === profile.name && mention === `@`) { hasReplyMentions = true; };
        }
    }
    document.getElementById("input-box").removeAttribute("data-replying-to");
    document.getElementById("reply-indicator").style.display = "none";
    // REPLIES - END

    let groupMessage = null, isGrouped = false;
    if (lastMessageTimestamp && lastMessageAuthor === data.name && lastMessageAvatar === data.avatar && !replyToID && !FLAG_startNewGroup) {
        const timeDiff = (new Date(timestamp) - new Date(lastMessageTimestamp)) / (1000 * 60); if (timeDiff < 10) { groupMessage = currentMessageGroup; isGrouped = true; }
    }
    if (!groupMessage || document.getElementById("messages").children.length === 0) {
        groupMessage = document.createElement("div"); groupMessage.classList.add("message-group"); document.getElementById("messages").appendChild(groupMessage);
        isGrouped = false;
    }
    const messageElement = document.createElement("div"); messageElement.classList.add("message");

    // AUTOMOD
    function checkBlocked(msg, list, exceptions) {
        return list.some(p => {
            let match; if (p instanceof RegExp) {
                match = p.test(msg);
            } else {
                if (p.startsWith('*') && p.endsWith('*')) {
                    match = new RegExp(p.replace(/^\*|\*$/g, ""), "i").test(msg);
                } else if (p.startsWith('*')) {
                    match = new RegExp(p.replace(/^\*|\*$/g, "") + "\\b", "i").test(msg);
                } else if (p.endsWith('*')) {
                    match = new RegExp("\\b" + p.replace(/^\*|\*$/g, ""), "i").test(msg);
                } else { match = new RegExp(`\\b${p}\\b`, "i").test(msg); }
            }
            if (match) {
                return !exceptions.some(ex => {
                    let exceptionMatch;
                    if (ex.startsWith('*') && ex.endsWith('*')) {
                        exceptionMatch = new RegExp(ex.replace(/^\*|\*$/g, ""), "i").test(msg);
                    } else if (ex.startsWith('*')) {
                        exceptionMatch = new RegExp(ex.replace(/^\*|\*$/g, "") + "\\b", "i").test(msg);
                    } else if (ex.endsWith('*')) {
                        exceptionMatch = new RegExp("\\b" + ex.replace(/^\*|\*$/g, ""), "i").test(msg);
                    } else { exceptionMatch = new RegExp(`\\b${ex}\\b`, "i").test(msg); }
                    return exceptionMatch;
                });
            }
            return false;
        });
    }
    let userBlocked = checkBlocked(content, [...userBlockedStrings, ...userBlockedMatches], userExceptions);
    let systemBlocked = !userBlocked && checkBlocked(content, [...blockedStrings, ...blockedMatches], systemExceptions);
    let containsBlockedContent = userBlocked ? "user" : systemBlocked ? "system" : null;
    if (containsBlockedContent) {
        messageHTML += containsBlockedContent === "user" ? `${selfAutomodFooter}${eph}` : `${automodFooter}${eph}`;
        messageElement.setAttribute("data-blocked", true); messageElement.classList.add("error");
    }
    // AUTOMOD - END

    if (isGrouped) messageElement.classList.add("grouped");
    if (hasMentions) messageElement.classList.add("mention");

    if (JSON.parse(localStorage.getItem('sparkly-enabled'))) {
        if (messageElement.getAttribute(`data-blocked`) === true) return;
        setTimeout(async () => { sendSystemMessage({ content: await getResponse(content), type: "ai" }); }, rand(500, 1500))
    }

    messageElement.setAttribute("data-timestamp", timestamp);
    messageElement.setAttribute("data-content", content);
    messageElement.setAttribute("data-author", data.name);
    messageElement.setAttribute("data-avatar", data.avatar);
    messageElement.setAttribute("data-username", data.username);
    messageElement.setAttribute("data-id", data.id);
    messageElement.setAttribute("data-userid", data.userid);
    messageElement.setAttribute("data-color", data.color);
    if (hasAttachments) { messageElement.setAttribute("data-hasAttachments", "true"); }
    messageElement.id = data.id;
    messageElement.innerHTML = isGrouped ?
        `<div class="message-background"><span class="timestamp" data-timestamp="${timestamp}">${formatTimestamp(timestamp, grouped = true)}</span><div class="message-content">${messageHTML}</div></div>` :
        `<img class="profile-pic" src="${data.avatar}"><div class="message-background"><div class="message-content"><div class="author" style="color: ${data.color}">${data.name} <span class="timestamp" data-timestamp="${timestamp}">${formatTimestamp(timestamp)}</span></div>${messageHTML}</div></div>`;

    if (replyToID && replyHTML) {
        const replyWrapper = document.createElement("div"); replyWrapper.className = "reply-thread";
        replyWrapper.innerHTML = `
            <div class="reply-preview" onclick="jumpToMsg(\`${replyToID}\`)">
                <span class="reply-spine">┌──</span>
                ${replyHTML}
            </div>
        `;
        replyWrapper.appendChild(messageElement);
        groupMessage.appendChild(replyWrapper);
        if (hasReplyMentions) replyWrapper.classList.add("mention");
    } else {
        groupMessage.appendChild(messageElement);
    }

    applyHighlighting(messageElement);
    lastMessageTimestamp = timestamp; lastMessageAuthor = data.name; lastMessageAvatar = data.avatar;
    currentMessageGroup = groupMessage; lastMessage = messageElement; messageInput.value = ""; history.push(""); historyIndex = history.length - 1;
    currentAttachments = []; document.querySelectorAll(".attachment-wrapper").forEach(wrapper => wrapper.remove());
    scrollToBottom();
    updateSendButtonColor();
}
// Helper function to process file for message
async function processFileForMessage(attachment) {
    return new Promise((resolve) => { const reader = new FileReader(); reader.onload = (e) => { resolve(e.target.result); }; reader.readAsDataURL(attachment.file); });
}
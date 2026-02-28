class Parser {
    static trim(text) {
        // start and end, but not middle
        const START_REGEX = /^[\u000A\u000D\u0009\u0020\u000B\u000C\u00A0\u202E\uFE05\uFE06\uFE07\uFE08\uFE09\uFE0A\uFE0B\uFE0C\uFE0D\uFE0E\uFE0F\uFEFF\u{E0105}\u{E0106}\u{E0107}\u{E0108}\u{E0109}\u{E010A}\u{E010B}\u{E010C}\u{E010D}\u{E010E}\u{E010F}\u{E0110}\u{E0111}\u{E0112}\u{E0113}\u{E0114}\u{E0115}\u{E0116}\u{E0117}\u{E0118}\u{E0119}\u{E011A}\u{E011B}\u{E011C}\u{E011D}\u{E011E}\u{E011F}\u{E0120}\u{E0121}\u{E0122}\u{E0123}\u{E0124}\u{E0125}\u{E0126}\u{E0127}\u{E0128}\u{E0129}\u{E012A}\u{E012B}\u{E012C}\u{E012D}\u{E012E}\u{E012F}\u{E0130}\u{E0131}\u{E0132}\u{E0133}\u{E0134}\u{E0135}\u{E0136}\u{E0137}\u{E0138}\u{E0139}\u{E013A}\u{E013B}\u{E013C}\u{E013D}\u{E013E}\u{E013F}\u{E0140}\u{E0141}\u{E0142}\u{E0143}\u{E0144}\u{E0145}\u{E0146}\u{E0147}\u{E0148}\u{E0149}\u{E014A}\u{E014B}\u{E014C}\u{E014D}\u{E014E}\u{E014F}\u{E0150}\u{E0151}\u{E0152}\u{E0153}\u{E0154}\u{E0155}\u{E0156}\u{E0157}\u{E0158}\u{E0159}\u{E015A}\u{E015B}\u{E015C}\u{E015D}\u{E015E}\u{E015F}\u{E0160}\u{E0161}\u{E0162}\u{E0163}\u{E0164}\u{E0165}\u{E0166}\u{E0167}\u{E0168}\u{E0169}\u{E016A}\u{E016B}\u{E016C}\u{E016D}\u{E016E}\u{E016F}\u{E0170}\u{E0171}\u{E0172}\u{E0173}\u{E0174}\u{E0175}\u{E0176}\u{E0177}\u{E0178}\u{E0179}\u{E017A}\u{E017B}\u{E017C}\u{E017D}\u{E017E}\u{E017F}\u{E0180}\u{E0181}\u{E0182}\u{E0183}\u{E0184}\u{E0185}\u{E0186}\u{E0187}\u{E0188}\u{E0189}\u{E018A}\u{E018B}\u{E018C}\u{E018D}\u{E018E}\u{E018F}\u{E0190}\u{E0191}\u{E0192}\u{E0193}\u{E0194}\u{E0195}\u{E0196}\u{E0197}\u{E0198}\u{E0199}\u{E019A}\u{E019B}\u{E019C}\u{E019D}\u{E019E}\u{E019F}\u{E01A0}\u{E01A1}\u{E01A2}\u{E01A3}\u{E01A4}\u{E01A5}\u{E01A6}\u{E01A7}\u{E01A8}\u{E01A9}\u{E01AA}\u{E01AB}\u{E01AC}\u{E01AD}\u{E01AE}\u{E01AF}\u{E01B0}\u{E01B1}\u{E01B2}\u{E01B3}\u{E01B4}\u{E01B5}\u{E01B6}\u{E01B7}\u{E01B8}\u{E01B9}\u{E01BA}\u{E01BB}\u{E01BC}\u{E01BD}\u{E01BE}\u{E01BF}\u{E01C0}\u{E01C1}\u{E01C2}\u{E01C3}\u{E01C4}\u{E01C5}\u{E01C6}\u{E01C7}\u{E01C8}\u{E01C9}\u{E01CA}\u{E01CB}\u{E01CC}\u{E01CD}\u{E01CE}\u{E01CF}\u{E01D0}\u{E01D1}\u{E01D2}\u{E01D3}\u{E01D4}\u{E01D5}\u{E01D6}\u{E01D7}\u{E01D8}\u{E01D9}\u{E01DA}\u{E01DB}\u{E01DC}\u{E01DD}\u{E01DE}\u{E01DF}\u{E01E0}\u{E01E1}\u{E01E2}\u{E01E3}\u{E01E4}\u{E01E5}\u{E01E6}\u{E01E7}\u{E01E8}\u{E01E9}\u{E01EA}\u{E01EB}\u{E01EC}\u{E01ED}\u{E01EE}\u{E01EF}]+/u;

        const END_REGEX = /[\u000A\u000D\u0009\u0020\u000B\u000C\u00A0\u202E\uFE05\uFE06\uFE07\uFE08\uFE09\uFE0A\uFE0B\uFE0C\uFE0D\uFE0E\uFE0F\uFEFF\u{E0105}\u{E0106}\u{E0107}\u{E0108}\u{E0109}\u{E010A}\u{E010B}\u{E010C}\u{E010D}\u{E010E}\u{E010F}\u{E0110}\u{E0111}\u{E0112}\u{E0113}\u{E0114}\u{E0115}\u{E0116}\u{E0117}\u{E0118}\u{E0119}\u{E011A}\u{E011B}\u{E011C}\u{E011D}\u{E011E}\u{E011F}\u{E0120}\u{E0121}\u{E0122}\u{E0123}\u{E0124}\u{E0125}\u{E0126}\u{E0127}\u{E0128}\u{E0129}\u{E012A}\u{E012B}\u{E012C}\u{E012D}\u{E012E}\u{E012F}\u{E0130}\u{E0131}\u{E0132}\u{E0133}\u{E0134}\u{E0135}\u{E0136}\u{E0137}\u{E0138}\u{E0139}\u{E013A}\u{E013B}\u{E013C}\u{E013D}\u{E013E}\u{E013F}\u{E0140}\u{E0141}\u{E0142}\u{E0143}\u{E0144}\u{E0145}\u{E0146}\u{E0147}\u{E0148}\u{E0149}\u{E014A}\u{E014B}\u{E014C}\u{E014D}\u{E014E}\u{E014F}\u{E0150}\u{E0151}\u{E0152}\u{E0153}\u{E0154}\u{E0155}\u{E0156}\u{E0157}\u{E0158}\u{E0159}\u{E015A}\u{E015B}\u{E015C}\u{E015D}\u{E015E}\u{E015F}\u{E0160}\u{E0161}\u{E0162}\u{E0163}\u{E0164}\u{E0165}\u{E0166}\u{E0167}\u{E0168}\u{E0169}\u{E016A}\u{E016B}\u{E016C}\u{E016D}\u{E016E}\u{E016F}\u{E0170}\u{E0171}\u{E0172}\u{E0173}\u{E0174}\u{E0175}\u{E0176}\u{E0177}\u{E0178}\u{E0179}\u{E017A}\u{E017B}\u{E017C}\u{E017D}\u{E017E}\u{E017F}\u{E0180}\u{E0181}\u{E0182}\u{E0183}\u{E0184}\u{E0185}\u{E0186}\u{E0187}\u{E0188}\u{E0189}\u{E018A}\u{E018B}\u{E018C}\u{E018D}\u{E018E}\u{E018F}\u{E0190}\u{E0191}\u{E0192}\u{E0193}\u{E0194}\u{E0195}\u{E0196}\u{E0197}\u{E0198}\u{E0199}\u{E019A}\u{E019B}\u{E019C}\u{E019D}\u{E019E}\u{E019F}\u{E01A0}\u{E01A1}\u{E01A2}\u{E01A3}\u{E01A4}\u{E01A5}\u{E01A6}\u{E01A7}\u{E01A8}\u{E01A9}\u{E01AA}\u{E01AB}\u{E01AC}\u{E01AD}\u{E01AE}\u{E01AF}\u{E01B0}\u{E01B1}\u{E01B2}\u{E01B3}\u{E01B4}\u{E01B5}\u{E01B6}\u{E01B7}\u{E01B8}\u{E01B9}\u{E01BA}\u{E01BB}\u{E01BC}\u{E01BD}\u{E01BE}\u{E01BF}\u{E01C0}\u{E01C1}\u{E01C2}\u{E01C3}\u{E01C4}\u{E01C5}\u{E01C6}\u{E01C7}\u{E01C8}\u{E01C9}\u{E01CA}\u{E01CB}\u{E01CC}\u{E01CD}\u{E01CE}\u{E01CF}\u{E01D0}\u{E01D1}\u{E01D2}\u{E01D3}\u{E01D4}\u{E01D5}\u{E01D6}\u{E01D7}\u{E01D8}\u{E01D9}\u{E01DA}\u{E01DB}\u{E01DC}\u{E01DD}\u{E01DE}\u{E01DF}\u{E01E0}\u{E01E1}\u{E01E2}\u{E01E3}\u{E01E4}\u{E01E5}\u{E01E6}\u{E01E7}\u{E01E8}\u{E01E9}\u{E01EA}\u{E01EB}\u{E01EC}\u{E01ED}\u{E01EE}\u{E01EF}]+$/u;

        // middle of the message
        const MIDDLE_REGEX = /[\u0009\u000C\u202E\uFE05\uFE06\uFE07\uFE08\uFE09\uFE0A\uFE0B\uFE0C\uFE0D\uFE0E\uFE0F\uFEFF\u{E0105}\u{E0106}\u{E0107}\u{E0108}\u{E0109}\u{E010A}\u{E010B}\u{E010C}\u{E010D}\u{E010E}\u{E010F}\u{E0110}\u{E0111}\u{E0112}\u{E0113}\u{E0114}\u{E0115}\u{E0116}\u{E0117}\u{E0118}\u{E0119}\u{E011A}\u{E011B}\u{E011C}\u{E011D}\u{E011E}\u{E011F}\u{E0120}\u{E0121}\u{E0122}\u{E0123}\u{E0124}\u{E0125}\u{E0126}\u{E0127}\u{E0128}\u{E0129}\u{E012A}\u{E012B}\u{E012C}\u{E012D}\u{E012E}\u{E012F}\u{E0130}\u{E0131}\u{E0132}\u{E0133}\u{E0134}\u{E0135}\u{E0136}\u{E0137}\u{E0138}\u{E0139}\u{E013A}\u{E013B}\u{E013C}\u{E013D}\u{E013E}\u{E013F}\u{E0140}\u{E0141}\u{E0142}\u{E0143}\u{E0144}\u{E0145}\u{E0146}\u{E0147}\u{E0148}\u{E0149}\u{E014A}\u{E014B}\u{E014C}\u{E014D}\u{E014E}\u{E014F}\u{E0150}\u{E0151}\u{E0152}\u{E0153}\u{E0154}\u{E0155}\u{E0156}\u{E0157}\u{E0158}\u{E0159}\u{E015A}\u{E015B}\u{E015C}\u{E015D}\u{E015E}\u{E015F}\u{E0160}\u{E0161}\u{E0162}\u{E0163}\u{E0164}\u{E0165}\u{E0166}\u{E0167}\u{E0168}\u{E0169}\u{E016A}\u{E016B}\u{E016C}\u{E016D}\u{E016E}\u{E016F}\u{E0170}\u{E0171}\u{E0172}\u{E0173}\u{E0174}\u{E0175}\u{E0176}\u{E0177}\u{E0178}\u{E0179}\u{E017A}\u{E017B}\u{E017C}\u{E017D}\u{E017E}\u{E017F}\u{E0180}\u{E0181}\u{E0182}\u{E0183}\u{E0184}\u{E0185}\u{E0186}\u{E0187}\u{E0188}\u{E0189}\u{E018A}\u{E018B}\u{E018C}\u{E018D}\u{E018E}\u{E018F}\u{E0190}\u{E0191}\u{E0192}\u{E0193}\u{E0194}\u{E0195}\u{E0196}\u{E0197}\u{E0198}\u{E0199}\u{E019A}\u{E019B}\u{E019C}\u{E019D}\u{E019E}\u{E019F}\u{E01A0}\u{E01A1}\u{E01A2}\u{E01A3}\u{E01A4}\u{E01A5}\u{E01A6}\u{E01A7}\u{E01A8}\u{E01A9}\u{E01AA}\u{E01AB}\u{E01AC}\u{E01AD}\u{E01AE}\u{E01AF}\u{E01B0}\u{E01B1}\u{E01B2}\u{E01B3}\u{E01B4}\u{E01B5}\u{E01B6}\u{E01B7}\u{E01B8}\u{E01B9}\u{E01BA}\u{E01BB}\u{E01BC}\u{E01BD}\u{E01BE}\u{E01BF}\u{E01C0}\u{E01C1}\u{E01C2}\u{E01C3}\u{E01C4}\u{E01C5}\u{E01C6}\u{E01C7}\u{E01C8}\u{E01C9}\u{E01CA}\u{E01CB}\u{E01CC}\u{E01CD}\u{E01CE}\u{E01CF}\u{E01D0}\u{E01D1}\u{E01D2}\u{E01D3}\u{E01D4}\u{E01D5}\u{E01D6}\u{E01D7}\u{E01D8}\u{E01D9}\u{E01DA}\u{E01DB}\u{E01DC}\u{E01DD}\u{E01DE}\u{E01DF}\u{E01E0}\u{E01E1}\u{E01E2}\u{E01E3}\u{E01E4}\u{E01E5}\u{E01E6}\u{E01E7}\u{E01E8}\u{E01E9}\u{E01EA}\u{E01EB}\u{E01EC}\u{E01ED}\u{E01EE}\u{E01EF}]+/u;

        // rule 1. remove any characters that need not exist anywhere
        const afterRule1 = text.replace(MIDDLE_REGEX, "");

        // rule 2. remove anything from the edges (start, end)
        let afterRule2 = afterRule1.replace(START_REGEX, "");
        afterRule2 = afterRule2.replace(END_REGEX, "");

        return afterRule2;
        // return text;
    }
}


function flagAsEdited(msg, newText) {
    const contentElement = msg.querySelector(".content"), contentAttr = msg.getAttribute("data-content"), text = sanitizeInput(newText);
    const wasEdited = contentElement.querySelector(".edited-tag");
    const formattedText = getMentions(text);
    let hasMentions = checkMentions(formattedText)
    contentElement.innerHTML = parseMarkdown(convertEmoticons(formattedText));
    initializeTimestamps();
    msg.setAttribute("data-content", newText);
    applyHighlighting(msg);
    if (hasMentions) msg.classList.add("mention");
    if ((wasEdited && wasEdited.textContent === " (edited)") || (newText !== contentAttr && !contentElement.innerHTML.includes(" (edited)"))) {
        const tag = document.createElement("span"); tag.className = "edited-tag"; tag.textContent = " (edited)"; contentElement.appendChild(tag);
    }
};

const messageActivities = new MessageActivities();

async function sendMessage() {
    const messageInput = $("#input-box"), content = Parser.trim(messageInput.value), hasAttachments = currentAttachments.length > 0;
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
    const timestamp = new Date().toISOString();
    // Flags
    let FLAG_startNewGroup = false;
    if (content.startsWith("@g")) {
        convertedContent = convertedContent.replace("@g", "")
        FLAG_startNewGroup = true;
    }
    // End of flags

    if (content.match(/s\/([^\/]+)\/([^\/]+)/)) {
        let match = content.match(/s\/([^\/]+)\/([^\/]+)/), textToReplace = match[1], replacement = match[2];
        const lastMsg = [...document.querySelectorAll(`#messages .message[data-userid='${humans.self.id}']`)].at(-1);
        if (lastMsg) {
            let text = lastMsg.querySelector(".content").innerHTML;
            text = text.replace(new RegExp(textToReplace, "i"), replacement);
            flagAsEdited(lastMsg, text)
            messageInput.value = ""; history.push(""); historyIndex = history.length - 1; updateSendButtonColor(); return;
        }
    }

    // MESSAGE DATA
    const data = {
        name: humans.self.name, content,
        username: humans.self.username,
        userid: humans.self.id,
        avatar: humans.self.avatar,
        tag: {
            name: "Sparkler",
            image: `${rootPath}/assets/icons/icon.png`
        },
        role: {
            name: "Sparkler", 
            color: DEFAULT_COLOR,
            color1: "#fcdd2dff", color2: "#ffffffff", color3: HOLOGRAPHIC_COLOR3,
            gradient: true, holographic: false,
            // icon: `${rootPath}/assets/icons/icon.png`
        },

        id: generateSnowflake(Date.now()).toString(),
        timestamp: timestamp,
        attachments: [],
        automodStatus: {
            isMessageBlockedByUser: null,
            isMessageBlockedBySystem: null,
            containsBlockedContent: null
        },

        reactions: [
            // { emoji: "🐱", type: "regular", count: 1, reacted: false },
            // { emoji: "👍", type: "regular", count: 212444, reacted: true }
        ]
    };
    if (localStorage.getItem("user-role-enabled" === "true")) { data.role.color = localStorage.getItem("user-role-color") || DEFAULT_COLOR; }
    // MESSAGE DATA END

    if (hasAttachments) {
        for (const attachment of currentAttachments) {
            const fileContent = await processFileForMessage(attachment);
            data.attachments.push({ id: attachment.id, name: attachment.name, type: attachment.type, size: (attachment.size), content: fileContent, internalType: attachment.internalType });
        }
    }

    let formattedContent = "", hasMentions = false, hasReplyMentions = false;
    if (content) {
        formattedContent = getMentions(convertedContent);
        hasMentions = checkMentions(formattedContent);
        formattedContent = parseMarkdown(formattedContent);
        initializeTimestamps();
    }
    let messageHTML = formattedContent ? `<div class="content">${formattedContent}</div>` : "";
    if (hasAttachments) {
        messageHTML += `<div class="attachments">`;
        for (const attachment of data.attachments) {
            if (attachment.internalType === "image") {
                messageHTML += `<div class="attachment media">
                                    <img src="${attachment.content}" alt="Image">
                                    <a href="${attachment.content}" download="${attachment.name}" style="display: none;"></a>
                                </div>`;
            } else if (attachment.internalType === "video") {
                messageHTML += generatePlayerHTML(attachment, "video");
            } else if (attachment.internalType === "audio") {
                messageHTML += generatePlayerHTML(attachment, "audio");
            } else if (attachment.internalType === "text") {
                const textContent = new TextDecoder().decode(Uint8Array.from(atob(attachment.content.split(",").pop()), c => c.charCodeAt(0)));
                const lines = escapeHtml(textContent).split("\n");
                const chopped = lines.length - 100;
                const linesLeft = chopped > 0 ? `... (${chopped} line${(chopped === 1) ? "" : "s"} left)` : "";

                messageHTML += `<div class="attachment text">
                                    <div class="text-attachment-container tx-collapsed" style="--total-lines: ${Math.min(lines.length, 101)};">
                                        <div class="textfile">${[...lines.slice(0, 100), linesLeft].join("\n")}</div>
                                        <div class="text-controls">
                                            <div class="tx-left">
                                                <button class="tx-expand" onclick="this.closest('.text-attachment-container').classList.replace('tx-collapsed', 'tx-expanded')">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                                    Expand
                                                </button>
                                                <button class="tx-collapse" onclick="this.closest('.text-attachment-container').classList.replace('tx-expanded', 'tx-collapsed')">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                                    Collapse
                                                </button>
                                            </div>

                                            <div class="tx-right">
                                                <span class="tx-fname">${attachment.name}</span>
                                                <span class="tx-fsize">${AttachmentHandler.formatSize(attachment.size)}</span>
                                                <button class="tx-download" onclick="this.closest('.attachment').querySelector('a[download]').click();">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <a href="${attachment.content}" download="${attachment.name}" style="display: none;"></a>
                                </div>`;
            } else {
                messageHTML += `<div class="attachment file-other">
                                    <img class="file-icon" src="${AttachmentHandler.getFileIcon(attachment.type, attachment.name)}">
                                    <div class="file-info">
                                        <a href="${attachment.content}" class="link" target="_blank">${attachment.name}</a>
                                        <span class="file-size">${AttachmentHandler.formatSize(attachment.size)}</span>
                                    </div>

                                    <a href="${attachment.content}" download="${attachment.name}" style="display: none;"></a>
                                </div>`;
            }
        }
        messageHTML += `</div>`;
    }

    // REPLIES
    let replyHTML = "";
    const replyToID = $("#input-box").getAttribute("data-replying-to");

    if (replyToID) {
        const repliedMsg = $(`[id='${replyToID}']`);

        repliedMsg.classList.remove("replying");
        if (repliedMsg.parentElement?.matches(".reply-thread")) repliedMsg.parentElement.classList.remove("replying");

        if (repliedMsg) {
            const replyAuthor = repliedMsg.getAttribute("data-author") || "";
            let replyContent = repliedMsg.getAttribute("data-content");
            let replyPFP = repliedMsg.getAttribute("data-avatar") || humans.self.defaultAvatar;
            const replyColor = repliedMsg.getAttribute("data-color");
            const mention = $("#input-box").getAttribute("data-pstate") === "true" ? `@` : "";
            const hasAttachments = repliedMsg.getAttribute("data-hasAttachments") === "true";
            const botTag = repliedMsg.getAttribute("data-botTag");
            let useEmptyPFPAndNoName = false;

            if (!replyContent && !hasAttachments) {
                useEmptyPFPAndNoName = true;
                replyContent = "*Message could not be loaded*";
            } else {
                useEmptyPFPAndNoName = false;
            }

            debugLog(repliedMsg);
            debugLog("replyContent:", replyContent);
            debugLog("hasAttachments:", hasAttachments);
            debugLog("replyAuthor:", replyAuthor);
            debugLog("Use empty profile picture and no name:", useEmptyPFPAndNoName);
            replyHTML = `<div class="reply-container">
                ${!useEmptyPFPAndNoName
                    ? `<img src="${replyPFP}">\n ${botTag ? botTag : ""}<span class="reply-author" style="color: ${replyColor};">${mention}${replyAuthor}</span>`
                    : replySVG
                }
                <span class="reply-content">
                    ${hasAttachments ? parseMarkdownLimited(replyContent || "*Click to see attachment*") + attachmentSVG : parseMarkdownLimited(replyContent)}
                </span>
            </div>`;
            debugLog("replyHTML:", replyHTML);
            if (replyAuthor === humans.self.name && mention === `@`) { hasReplyMentions = true; };
        }
    }
    $("#input-box").removeAttribute("data-replying-to");
    $("#reply-indicator").style.display = "none";
    // REPLIES - END

    // GROUPING
    let groupMessage = null, isGrouped = false;
    if (lastMessageTimestamp && lastMessageAuthor === data.name && lastMessageAvatar === data.avatar && !replyToID && !FLAG_startNewGroup) {
        const timeDiff = (new Date(timestamp) - new Date(lastMessageTimestamp)) / (1000 * 60);
        if (timeDiff < 10) {
            groupMessage = currentMessageGroup; isGrouped = true;
        }
    }
    
    if (!groupMessage || $("#messages").children.length === 0) {
        groupMessage = document.createElement("div"); groupMessage.classList.add("message-group"); $("#messages").appendChild(groupMessage);
        isGrouped = false;
    }
    const messageElement = document.createElement("div"); messageElement.classList.add("message");
    // GROUPING - END

    // AUTOMOD
    const userBlocked = AutoMod.checkMessage(content, [...AutoMod.user.strings, ...AutoMod.user.matches], AutoMod.user.exceptions);
    const systemBlocked = !userBlocked && AutoMod.checkMessage(content, [...AutoMod.system.strings, ...AutoMod.system.matches], AutoMod.system.exceptions);
    const containsBlockedContent = userBlocked ? "user" : systemBlocked ? "system" : null;

    if (containsBlockedContent) {
        messageHTML += containsBlockedContent === "user" ? `${selfAutomodFooter}${eph}` : `${automodFooter}${eph}`;
        messageElement.setAttribute("data-blocked", true); messageElement.classList.add("error");
    }

    data.automodStatus = {
        isMessageBlockedByUser: userBlocked,
        isMessageBlockedBySystem: systemBlocked,
        containsBlockedContent: containsBlockedContent
    }
    // AUTOMOD - END

    // FINAL TOUCHES
    if (isGrouped) messageElement.classList.add("grouped");
    if (hasMentions) messageElement.classList.add("mention");

    messageElement.setAttribute("data-timestamp", timestamp);
    messageElement.setAttribute("data-content", content);
    messageElement.setAttribute("data-author", data.name);
    messageElement.setAttribute("data-avatar", data.avatar);
    messageElement.setAttribute("data-username", data.username);
    messageElement.setAttribute("data-id", data.id);
    messageElement.setAttribute("data-userid", data.userid);
    messageElement.setAttribute("data-color", data.role.color);
    messageElement.setAttribute("data-hasAttachments", hasAttachments ? "true" : "false");
    messageElement.id = data.id;
    messageElement.innerHTML = isGrouped ?
        `<div class="message-background">
            <span class="timestamp" data-timestamp="${timestamp}">${formatTimestamp(timestamp, grouped = true)}</span>
            <div class="message-content">${messageHTML}</div>
        </div>` :
        `<img class="profile-pic" src="${data.avatar}">
        <div class="message-background">
            <div class="message-content">
                <div class="author">
                    <span
                    class="name ${data.role.gradient === true ? `${data.role.holographic === true ? `useTricolorGradient` : `useGradient`}` : ""}"
                    style="${data.role.gradient === true
            ? `${data.role.holographic === true
                ? `--name-gradient-color-1: #a9c9ff; --name-gradient-color-2: #ffbbec; --name-gradient-color-3: #ffc3a0;`
                : `--name-gradient-color-1: ${data.role.color1}; --name-gradient-color-2: ${data.role.color2};`}
                            -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;`
            : ` color: ${data.role.color};`}">
                        ${data.name}
                    </span>
                    <span class="nameTag" role="button"><span class="nameTagText" style="color: var(--text-normal);">
                        <img alt="[${data.tag.name}]" class="nameTagBadge" width="12" height="12" src="${data.tag.image}?size=16">
                        <span style="user-select: none">${data.tag.name}</span>
                    </span>
                    </span>
                    ${data.role.icon ? `<img class="roleIcon" height="20" width="20" src="${data.role.icon}?size=20&quality=lossless" title="${data.role.name}"></span>` : ""}
                    <span class="timestamp" data-timestamp="${timestamp}">${formatTimestamp(timestamp)}</span>
                </div>
                ${messageHTML}
                <div class="reaction-container">
                    ${data.reactions.map((reaction) => getReactionHTML(reaction)).join("")}
                </div>
            </div>
        </div>`;

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
        eventBus.emit("msgReply", {
            originalMsg: $(`[id='${replyToID}']`),  // Message being replied to
            replyMsg: messageElement,   // The message replying to the originalMsg
            timestamp: Date.now()
        });
    } else {
        groupMessage.appendChild(messageElement);
    }

    applyHighlighting(messageElement);
    lastMessageTimestamp = timestamp;
    lastMessageAuthor = data.name;
    lastMessageAvatar = data.avatar;
    currentMessageGroup = groupMessage;
    lastMessage = messageElement;

    if (containsBlockedContent) {
        messageElement.querySelector(".dismiss").addEventListener("click", () => messageActivities.deleteMessage(messageElement));
    }

    messageInput.value = "";
    history.push("");
    historyIndex = history.length - 1;

    currentAttachments = [];
    document.querySelectorAll(".attachment-wrapper").forEach(wrapper => wrapper.remove());

    scrollToBottom();
    updateSendButtonColor();

    // SparkleCord.messages[data.id] = data;
    eventBus.emit("msgSend", { message: messageElement, messageData: data });

    setTimeout(setupMediaPlayers, 1500);
}

// Helper function to process file for message
async function processFileForMessage(attachment) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(attachment.file);
    });
}
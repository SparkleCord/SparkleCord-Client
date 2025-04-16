const commands = [
    { name: "version", description: "Send version name and info.", execute: () => 
        sendSystemMessage( { content: `You are using SparkleCord ${versionType} version ${versionCode} on the ${versionState} build.` } ) 
    },
    { name: "purge", description: "Delete all messages, This cannot be undone.", execute: () => purgeMessages() },
    { name: "me", description: "Displays text with emphasis.", modifyMessage: (args) => `_${sanitizeInput(args)}_` },
    { name: "shrug", description: "Append ¯\\_(ツ)_/¯ to your message.", modifyMessage: (args) => `${sanitizeInput(args)} ¯\\_(ツ)_/¯` },
    { name: "tableflip", description: "Append (╯°□°)╯︵ ┻━┻ to your message.", modifyMessage: (args) => `${sanitizeInput(args)} (╯°□°)╯︵ ┻━┻` },
    { name: "unflip", description: "Append ┬─┬ノ( º _ ºノ) to your message.", modifyMessage: (args) => `${sanitizeInput(args)} ┬─┬ノ( º _ ºノ)` },
    { name: "spoiler", description: "Marks your message as a spoiler.", modifyMessage: (args) => `||${sanitizeInput(args)}||` },
    { name: "profile", description: "Send your user info.", execute: () => 
        sendSystemMessage({
            content: "Your Profile!",
            embeds: [
                {
                    author: { name: profile.name, icon: profile.avatar },
                    color: 0x23A55A,
                    fields: [
                        { name: "Global Name", value: profile.name, inline: true },
                        { name: "Username", value: profile.username, inline: true },
                        { name: "Status", value: profile.status, inline: true },
                        { name: "ID", value: profile.id, inline: true }
                    ],
                    footer: { text: profile.username, icon: profile.avatar },
                    timestamp: new Date().toISOString()
                }
            ]
        })
    },
   
];

function purgeMessages() {
    const messages = $("messages").querySelectorAll(".message"), a = messages.length;
    messages.forEach(msg => msg.remove());
    sendSystemMessage( { content: `Cleared **${a}** ${a === 1 ? "message" : "messages"}.` } );
}

document.addEventListener("DOMContentLoaded", () => {
   // sendSystemMessage({ content: "Invalid embed test", embeds: "This should be an array but it's a string" }); // embeds.forEach error
   // sendSystemMessage({ content: "Invalid embed test", embeds: null }); // embeds.forEach error
   // sendSystemMessage({ content: "Broken fields test", embeds: [{ fields: "This should be an array" }] }); // embed.fields.map error
   // sendSystemMessage({ content: "Broken fields test", embeds: [{ fields: null }] }); // embed.fields.map error
   // sendSystemMessage({ content: null }); // empty message error
   // sendSystemMessage(`Bro found the secret message :skull: :sob: :pray:\n-# What the heck is a light mode??\n-# Oh hi i see you're looking at the source code`);
});

// important
function sendSystemMessage({ content = "", embeds = [], type = "core" } = {}) {
    try {
        if (content === undefined || content === null) throw new Error("Cannot send an empty message");

        const data = { 
            username: systemUsers[type].username, name: systemUsers[type].name, avatar: systemUsers[type].avatar, content: content, attachments: [], userid: systemUsers[type].id.toString()
        };
        data.id = generateSnowflake(Date.now()).toString();

        const timestamp = new Date().toISOString();
        let formattedContent = content ? parseMarkdown(content) : '';
        let hasMentions = false;
        if (content) {
            const replacedContent = content.replace(mentionPattern,(_,mention)=>`<span class="ping">@${mention.toLowerCase()===profile.name.toLowerCase()?profile.name:mention.toLowerCase()}</span>`);
            if (replacedContent !== content) {hasMentions = true; formattedContent = parseMarkdown(replacedContent);} else {formattedContent = parseMarkdown(content);}
        }
        let messageHTML = `<div class="content">${formattedContent}</div>`;
        embeds.forEach(embed => {
            let embedColor = embed.color !== undefined ? `border-left: 4px solid #${embed.color.toString(16).padStart(6, "0")};` : "";
            let embedContent = `
                ${embed.author ? `<div class="embed-author">
                    ${embed.author.icon ? `<img class="embed-author-icon" src="${embed.author.icon}">` : ""}
                    <span class="embed-author-name">${embed.author.name}</span>
                </div>` : ""}
                ${embed.title ? `<div class="embed-title">${embed.title}</div>` : ""}
                ${embed.description ? `<div class="embed-description">${parseMarkdown(String(embed.description))}</div>` : ""}
                ${embed.fields ? `<div class="embed-fields">${embed.fields.map(field => 
                    `<div class="embed-field${field.inline ? ' inline' : ''}">
                        <div class="embed-field-name">${field.name}</div>
                        <div class="embed-field-value">${parseMarkdown(String(field.value))}</div>
                    </div>`).join("")}</div>` : ""}
                ${embed.footer ? `<div class="embed-footer">
                    ${embed.footer.icon ? `<img class="embed-footer-icon" src="${embed.footer.icon}">` : ""}
                    <span class="embed-footer-text">${embed.footer.text}${embed.timestamp ? ` • ${formatTimestamp(embed.timestamp)}` : ""}</span>
                </div>` : embed.timestamp ? `<div class="embed-footer"><span class="embed-footer-text">${formatTimestamp(embed.timestamp)}</span></div>` : ""}`;
            if (embedContent.trim()) {messageHTML += `<div class="embed" style="${embedColor}">${embedContent}</div>`;} else {throw new Error("Cannot send an empty embed, Please validate your embed then try again");}
        });
        let groupMessage = null, isGrouped = false;
        if (lastMessageTimestamp && lastMessageAuthor === systemUsers[type].name) {
            const timeDiff = (new Date(timestamp) - new Date(lastMessageTimestamp)) / (1000 * 60); if (timeDiff < 10) {groupMessage = sysGroups[type]; isGrouped = true;}
        }
        if (!groupMessage || document.getElementById("messages").children.length === 0) {
            groupMessage = document.createElement("div"); groupMessage.classList.add("message-group"); document.getElementById("messages").appendChild(groupMessage);
            isGrouped = false;
        }
        const messageElement = document.createElement("div"); 
        messageElement.classList.add("message"); if (type === "core" || type === "error") messageElement.classList.add("eph");
        
        messageElement.setAttribute("data-timestamp", timestamp);
        messageElement.setAttribute("data-content", content);
        messageElement.setAttribute("data-author", data.name);
        messageElement.setAttribute("data-avatar", data.avatar);
        messageElement.setAttribute("data-userid", data.userid);
        messageElement.setAttribute("data-id", data.id);
        messageElement.setAttribute("data-nametag", `<span class="namebadge" style="background: ${systemUsers[type].tag.bg};">${systemUsers[type].tag.verified ? `${verified}` : ``} <span class="text">${systemUsers[type].tag.name}</span></span>`);
        messageElement.id = data.id;

        if (isGrouped) messageElement.classList.add("grouped"); if (hasMentions) messageElement.classList.add("mention");
        messageElement.innerHTML = isGrouped ?
            `<div class="message-background"><span class="timestamp" data-timestamp="${timestamp}">${formatTimestamp(timestamp, grouped = true)}</span><div class="message-content">${messageHTML} ${type === "core" || type === "error" ? eph : ''}</div></div>` :
            `<img class="profile-pic" src="${systemUsers[type].avatar}">
            <div class="message-background">
                <div class="message-content">
                    <div class="author">${systemUsers[type].name}
                        <span class="namebadge" style="background: ${systemUsers[type].tag.bg};">${systemUsers[type].tag.verified ? `${verified}` : ``} <span class="text">${systemUsers[type].tag.name}</span></span><span class="timestamp">${formatTimestamp(timestamp)}</span>
                    </div>
                  ${messageHTML}
                  ${type === "core" || type === "error" ? eph : ''}
                </div>
            </div>`;
        groupMessage.appendChild(messageElement);
        applyHighlighting(messageElement);
        lastMessageTimestamp = timestamp; lastMessageAuthor = systemUsers[type].name; sysGroups[type] = groupMessage; lastMessage = messageElement;
        scrollToBottom();
        if (type === "core" || type === "error") {
            const dismissButton = messageElement.querySelector(".dismiss"); dismissButton.addEventListener("click", () => messageElement.remove());
        }
    } catch (error) {
        let friendlyError;
        switch (true) {
            case error.message.includes("Cannot send an empty message"): friendlyError = error; break;
            case error.message.includes("embeds.forEach is not a function"): friendlyError = "Embeds should be an array, not a single object or something else"; break;
            case error.message.includes("Cannot read properties of null (reading 'forEach')"): friendlyError = "Embeds cannot be null. Try using an empty array instead"; break;
            case error.message.includes("embed.fields.map is not a function"): friendlyError = "Embed fields must be an array, not a single object or text"; break;
            case error.message.includes("Cannot read properties of null (reading 'map')"): friendlyError = "Embed fields cannot be null. Use an empty array if needed."; break;
            default: friendlyError = error;
        }
        console.error(friendlyError)
    }
}
// const discordRules = {
//     customEmoji: {
//         order: 0,
//         match: SimpleMarkdown.inlineRegex(/^<(a?):([a-zA-Z0-9_]+):(\d+)>/),
//         parse: function(capture) {
//             return { type: "customEmoji", animated: !!capture[1], name: capture[2], id: capture[3] };
//         }
//     },
//     mention: {
//         order: 1,
//         match: SimpleMarkdown.inlineRegex(/^<@!?(\d+)>/),
//         parse: function(capture) {
//             return { type: "mention", id: capture[1] };
//         }
//     },
//     roleMention: {
//         order: 1,
//         match: SimpleMarkdown.inlineRegex(/^<@&(\d+)>/),
//         parse: function(capture) {
//             return { type: "roleMention", id: capture[1] };
//         }
//     },
//     channelMention: {
//         order: 1,
//         match: SimpleMarkdown.inlineRegex(/^<#(\d+)>/),
//         parse: function(capture) {
//             return { type: "channelMention", id: capture[1] };
//         }
//     },
//     commandMention: {
//         order: 1,
//         match: SimpleMarkdown.inlineRegex(/^<\/(.+?):(\d+)>/),
//         parse: function(capture) {
//             return { type: "commandMention", name: capture[1], id: capture[2] };
//         }
//     },
//     timestamp: {
//         order: 1,
//         match: SimpleMarkdown.inlineRegex(/^<t:(\d{10})(?::([tTdDfFsSR]))?>/),
//         parse: function(capture) {
//             return { type: "timestamp", epoch: parseInt(capture[1], 10), format: capture[2] || "f"  };
//         }
//     },
//     autolink: {
//         order: 50,
//         match: SimpleMarkdown.inlineRegex(/^<([^: >]+:\/[^ >]+)>/),
//         parse: function(capture) {
//             return { type: "autolink", content: [{type: "text", content: capture[1]}], target: capture[1] };
//         }
//     },
//     mailto: {
//         order: 5,
//         match: SimpleMarkdown.inlineRegex(/^<([^ >]+@[^ >]+)>/),
//         parse: function(capture) {
//             return { type: "mailto", content: [{type: "text", content: capture[1]}], target: "mailto:" + capture[1] };
//         }
//     },
//     tel: {
//         order: 5,
//         match: SimpleMarkdown.inlineRegex(/^<((?:(?:tel|sms):\+?|\+)(?:(?:[0-9]|\([0-9]+\)))(?:[- .\/]?(?:[0-9]|\([0-9]+\)))+)>/),
//         parse: function(capture) {
//             let text = capture[1], target = text.replaceAll(/[ \/]+/g, "-");
//             if (!target.startsWith("tel:") && !target.startsWith("sms:")) target = "tel:" + target;

//             return { type: "link", content: [{type: "text", content: text}], target: target };
//         }
//     },
//     url: {
//         order: 60,
//         match: SimpleMarkdown.inlineRegex(/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/),
//         parse: function(capture) {
//             return { type: "url", content: [{type: "text", content: capture[1]}], target: capture[1] };
//         }
//     },
//     link: {
//         order: 70,
//         match: SimpleMarkdown.inlineRegex(/^\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\(\s*<?([\s\S]*?)>?(?:\s+"([\s\S]*?)")?\s*\)/),
//         parse: SimpleMarkdown.parseCaptureInline
//     },
//     em: {
//         order: 200, 
//         match: SimpleMarkdown.inlineRegex(/^\*(?=\S)((?:\*\*|\\[\s\S]|\s+(?:\\s\S]|[^\\s\*\\\]]|\*\*)|[^\\s\*\\\]])+?)\*(?!\*)|^\b_((?:__|\\[\s\S]|[^\\_])+?)_\b/),
//         parse: function(capture, parse, state) {
//             return { type: "em", content: parse(capture[2] || capture[1], state) };
//         }
//     },
//     looseEm: {
//         order: 201,
//         match: SimpleMarkdown.inlineRegex(/^\*(\s*[\s\S]*?\s*)\*(?!\*)/),
//         parse: function(capture, parse, state) {
//             let content = capture[1].trim();
//             return {
//                 type: "looseEm",
//                 content: parse(content, state)
//             };
//         }
//     },
//     strong: {
//         order: 100,
//         match: SimpleMarkdown.inlineRegex(/^\*\*([^\s*](?:[\s\S]*?[^\s*])?)\*\*(?!\*)/),
//         parse: SimpleMarkdown.parseCaptureInline
//     },
//     u: {
//         order: 300,
//         match: SimpleMarkdown.inlineRegex(/^__((?:\\[\s\S]|[^\\])+?)__(?!_)/),
//         parse: SimpleMarkdown.parseCaptureInline
//     },
//     s: {
//         order: 400,
//         match: SimpleMarkdown.inlineRegex(/^~~([\s\S]+?)~~(?!_)/),
//         parse: SimpleMarkdown.parseCaptureInline
//     },
//     spoiler: { order: 500, match: SimpleMarkdown.inlineRegex(/^\|\|([\s\S]+?)\|\|/), parse: SimpleMarkdown.parseCaptureInline },
//     subtext: {
//         order: 100,
//         match: SimpleMarkdown.blockRegex(/^-#\s?([^\n]+)/),
//         parse: function(capture, parse, state) {
//             return { type: "subtext", content: parse(capture[1], state) };
//         }
//     },
//     codeBlock: SimpleMarkdown.defaultRules.fence,
//     // blockQuote: {
//     //     order: 700,
//     //     match: SimpleMarkdown.blockRegex(/^>>> ([\s\S]*?)\n*$/),
//     //     parse: function(capture, parse, state) {
//     //         return { type: "blockQuote", content: parse(capture[1].split("\n").join("\n"), state) };
//     //     }
//     // },
//     escape: SimpleMarkdown.defaultRules.escape,
//     heading: SimpleMarkdown.defaultRules.heading,
//     // quote: SimpleMarkdown.defaultRules.blockQuote,
//     newline: SimpleMarkdown.defaultRules.newline,
//     text: SimpleMarkdown.defaultRules.text,
//     keybind: {
//         order: 550, // Higher than spoiler, lower than inlineCode
//         match: SimpleMarkdown.inlineRegex(/^\[\[(.*?)\]\]/),
//         parse: function(capture) {
//             return {
//                 type: "keybind",
//                 content: capture[1]
//             };
//         }
//     },
//     // Custom Badges: {{content}}
//     badge: {
//         order: 551, 
//         match: SimpleMarkdown.inlineRegex(/^\{\{(.*?)\}\}/),
//         parse: function(capture) {
//             return {
//                 type: "badge",
//                 content: capture[1]
//             };
//         }
//     },
//     // Custom Colored Text: [text]{color}
//     coloredText: {
//         order: 552, 
//         match: SimpleMarkdown.inlineRegex(/^\[([^\]]+)\]\{([^}]+)\}/),
//         parse: function(capture) {
//             return {
//                 type: "coloredText",
//                 content: capture[1],
//                 color: capture[2]
//             };
//         }
//     },
// };

// const discordRules2 = {...SimpleMarkdown.defaultRules};
// const discordOutputs2 = {...SimpleMarkdown.defaultHtml};

// const discordOutputs = {
//     text: (node) => node.content,
//     em: (node, recurse) => SimpleMarkdown.defaultHtmlTag("em", recurse(node.content)),
//     looseEm: (node, recurse) => SimpleMarkdown.defaultHtmlTag("em", recurse(node.content)),
//     strong: (node, recurse) => SimpleMarkdown.defaultHtmlTag("strong", recurse(node.content)),
//     u: (node, recurse) => SimpleMarkdown.defaultHtmlTag("u", recurse(node.content)),
//     s: (node, recurse) => SimpleMarkdown.defaultHtmlTag("s", recurse(node.content)),
//     spoiler: (node, recurse) => SimpleMarkdown.defaultHtmlTag("span", recurse(node.content), { class: "spoiler" }),
//     heading: (node, recurse) => SimpleMarkdown.defaultHtmlTag(`h${node.level}`, recurse(node.content)),
//     subtext: (node, recurse) => SimpleMarkdown.defaultHtmlTag("subtext", recurse(node.content)),
//     // inlineCode: (node) => SimpleMarkdown.defaultHtmlTag("code", SimpleMarkdown.sanitizeText(node.content)),
//     fence: (node, recurse) => {
//         return `<div class="code-wrapper"><pre><code class="hljs language-${node.lang || "plaintext"}">${SimpleMarkdown.sanitizeText(node.content.trim())}</code></pre></div>`;
//     },
//     // quote: (node, recurse) => SimpleMarkdown.defaultHtmlTag("blockquote", recurse(node.content)),
//     // blockQuote: (node, recurse) => SimpleMarkdown.defaultHtmlTag("blockquote", recurse(node.content)),
//     link: (node, recurse) => {
//         // https?|discord|tel|sms|mailto
//         const title = recurse(node.content).replace(/\r?\n/g, " ") + `\n\n(${node.target})`;
//         return SimpleMarkdown.defaultHtmlTag("a", recurse(node.content), {
//             href: node.target,
//             class: "link",
//             target: "_blank",
//             title: title
//         });
//     },
//     url: (node, recurse) => {
//         const url = node.target;
//         return SimpleMarkdown.defaultHtmlTag("a", recurse(node.content), {
//             href: url,
//             class: "link",
//             target: "_blank",
//             title: url
//         });
//     },
//     autolink: (node, recurse) => {
//         const url = node.target;
//         return SimpleMarkdown.defaultHtmlTag("a", recurse(node.content), {
//             href: url,
//             class: "link",
//             target: "_blank",
//             title: url
//         });
//     },
//     mailto: (node, recurse) => SimpleMarkdown.defaultHtmlTag("a", recurse(node.content), { href: node.target, class: "link" }),
//     tel: (node, recurse) => SimpleMarkdown.defaultHtmlTag("a", recurse(node.content), { href: node.target, class: "link" }),
//     customEmoji: (node) => SimpleMarkdown.defaultHtmlTag("span", SimpleMarkdown.sanitizeText(`:${node.name}:`), { class: node.animated ? "custom-emoji animated" : "custom-emoji" }),
//     mention: (node) => SimpleMarkdown.defaultHtmlTag("span", SimpleMarkdown.sanitizeText(`@${node.id}`), { class: "mention" }),
//     roleMention: (node) => SimpleMarkdown.defaultHtmlTag("span", SimpleMarkdown.sanitizeText(`@&${node.id}`), { class: "role-mention" }),
//     channelMention: (node) => SimpleMarkdown.defaultHtmlTag("span", SimpleMarkdown.sanitizeText(`#${node.id}`), { class: "channel-mention" }),
//     commandMention: (node) => SimpleMarkdown.defaultHtmlTag("span", SimpleMarkdown.sanitizeText(`/${node.name}`), { class: "command-mention" }),
//     timestamp: (node) => SimpleMarkdown.defaultHtmlTag("span", SimpleMarkdown.sanitizeText(`[${node.epoch}]`), { class: "timestamp" }),
//     newline: () => SimpleMarkdown.defaultHtmlTag("br"),
//     escape: (node) => SimpleMarkdown.sanitizeText(node.content),

//     keybind: (node) => defaultHtmlTag("span", SimpleMarkdown.sanitizeText(node.content), { class: "keybind" }),
//     badge: (node) => defaultHtmlTag("span", SimpleMarkdown.sanitizeText(node.content), { class: "badge" }),
//     coloredText: (node) => defaultHtmlTag("span", SimpleMarkdown.sanitizeText(node.content), { style: `color: ${node.color}` }),

// };

// function parseMarkdown(text) {
//     let html = text;
//     const htmlPlaceholders = []; 

//     html = replaceEmojiNames(html, false); 
//     html = replaceEmojis(html, false);

//     const emojiRegex = /(<span class="emoji-wrapper"[\s\S]+?<\/span>)/g;

//     html = html.replace(emojiRegex, (match) => { htmlPlaceholders.push(match); return `\u0000\u0002H${htmlPlaceholders.length - 1}\u0002\u0000`;});

//     const parser = SimpleMarkdown.parserFor(discordRules2); 
//     const outputter = SimpleMarkdown.outputFor(discordRules2, "html", discordOutputs2);

//     html = outputter(parser(html + "\n\n", { inline: false }));

//     html = html.replace(/\u0000\u0002H(\d+)\u0002\u0000/g, (match, index) => {
//         return htmlPlaceholders[parseInt(index)]; 
//     });

//     html = html.replace(/\n/g, "<br>");
//     html = html.replace(/(<\/h[1-3]>|<\/blockquote>|<br>)\s*<br>/g, "$1");
//     html = html.replace(/\\_\\_/g, '_'); 

//     return html;
// }


function parseMarkdown(text) {
    // Code blocks
    const codeBlocks = [];
    text = text.replace(/```(\w*)\n([\s\S]+?)\n```/g, (match, lang, code) => {
        codeBlocks.push({ lang: lang.toLowerCase() || "plaintext", code: code.trim() });
        return `\u0000\u0001C${codeBlocks.length - 1}\u0001\u0000`;
    });

    // Inline code
    const inlineCode = [];
    text = text.replace(/`([^`]+)`/g, (match, code) => {
        inlineCode.push(code);
        return `\u0000\u0001I${inlineCode.length - 1}\u0001\u0000`;
    });

    // Headers
    text = text.replace(/(?:^|\n)# (.+?)(?=\n|$)/g, "<h1>$1</h1>") // h1 header (# text)
        .replace(/(?:^|\n)## (.+?)(?=\n|$)/g, "<h2>$1</h2>") // h2 header (## text)
        .replace(/(?:^|\n)### (.+?)(?=\n|$)/g, "<h3>$1</h3>"); // h3 header (### text)

    // Escaped blocks
    const escapedBlocks = [];
    text = text.replace(/\\(.*?)\\/g, (match, content) => {
        escapedBlocks.push(content);
        return `\u0000\u0001E${escapedBlocks.length - 1}\u0001\u0000`;
    });

    // Emoji replacement
    text = replaceEmojiNames(text, false);
    text = replaceEmojis(text, false);

    // Masked Links
    const safeHtml = [];
    text = text.replace(/\[([^\[\]]+)\]\(((https?|discord|tel|sms|mailto):\/\/[^\s<>"]+)\)/gi, (match, t, url, protocol) => {
        if (/^(https?|discord|tel|sms|mailto):\/\//i.test(t)) return match;
        if (!/\/$/.test(url) && protocol !== "file") url += "/";

        safeHtml.push(`<a href="${url}" class="link" target="_blank" title="${t.replace(/\r?\n/g, " ")}\n\n(${url})">${t}</a>`);
        return `\u0000\u0001H${safeHtml.length - 1}\u0000`;
    });

    // Timestamp
    text = text.replace(/<t:(-?\d{1,17})(?::([tTdDfFsSR]))?>/g, (match, epoch, format) => {
        const formatType = format || "f"; // Default is "f" (LLL)
        const date = new Date(parseInt(epoch) * 1000);
        const formatted = formatTime(epoch, format);
        return `<span class="relativeTimestamp" data-relative="${format === "R"}" data-epoch="${epoch}" data-format="${formatType}" title="${date.toLocaleString()}">${formatted}</span>`;
    });

    // Email links
    text = text.replace(/<([^\s<>@]+@[^\s<>@]+\.[^\s<>@]+)>/g, (match, email) => {
        safeHtml.push(`<a href="mailto:${email}" class="link mailto" title="${email}\n\n(mailto:${email})">${email}</a>`);
        return `\u0000\u0001H${safeHtml.length - 1}\u0000`;
    });

    // Telephone links
    text = text.replace(/<((?:(?:tel|sms):\+?|\+)(?:(?:[0-9]|\([0-9]+\)))(?:[- .\/]?(?:[0-9]|\([0-9]+\)))+)>/g, (match, tel) => {
        let display = tel, href = tel.replaceAll(/[ \/]+/g, "-");
        if (!href.startsWith("tel:") && !href.startsWith("sms:")) href = "tel:" + href;
        safeHtml.push(`<a href="${href}" class="link tel" title="${display}\n\n(${href})">${display}</a>`);
        return `\u0000\u0001H${safeHtml.length - 1}\u0000`;
    });

    // Custom markdown
    text = text
        .replace(/\[\[(.*?)\]\]/g, '<span class="keybind">$1</span>') // Press [[ALT]] + [[F4]] To Unlock Free Robux! (Discord-style Keys)
        .replace(/{{(.*?)}}/g, '<span class="badge">$1</span>') // Check the {{31}} Notifications you got! (Red badge with white text)
        .replace(/\[([^\]]+)\]{([^}]+)}/g, '<span style="color: $2">$1</span>') // Colored Text
    // .replace(/#([^#]+)#/g, '<span style="font-family: var(--font-headline);">$1</span>') // #Text# (Headline)

    // Official Discord Markdown
    text = text
        .replace(/(?:^|\n)-# > (.+?)(?=\n|$)/g, '<subtext><blockquote>$1</blockquote></subtext>') // -# > Text (Subtext + Blockquote)
        .replace(/(?:^|\n)-# (.+?)(?=\n|$)/g, '<subtext>$1</subtext>') // -# Text (Subtext)
        .replace(/\|\|([^|]+)\|\|/g, '<span class="spoiler">$1</span>') // ||Text|| (Spoiler)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // **Text** (Bold)
        .replace(/__(.*?)__/g, '<u>$1</u>') // __Text__ (Underline)
        .replace(/\*([^*]+)\*/g, '<em>$1</em>') // Italic (*Text*)
        .replace(/(?<=\s|^)_(?=\S)(.+?)(?<=\S)_(?=\s|$)/g, '<em>$1</em>') // Italic (_Text_)
        .replace(/~~(.*?)~~/g, '<s>$1</s>') // ~~Text~~ (Strikethrough)
        .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>\u0000\u0003') // > Text (Blockquote)
    text = text.replace(/\n/g, "<br>").replace(/(<\/h[1-3]>|<\/blockquote>|<br>)\s*<br>/g, '$1');  // Line breaks

    // Normal Links
    text = text.replace(/\b((https?|discord|tel|sms|mailto):\/\/[^\s<>"'\]\)]+)/gi, (match) => {
        if (text.includes(`[${match}](`) || text.includes(`](${match})`)) return match;
        if (text.includes(`<img src="${match}"`)) return match;

        let url = match;
        if (!/\/$/.test(url) && !url.startsWith("file://")) url += '/';
        return `<a href="${url}" class="link" target="_blank" title="${url}">${url}</a>`;
    });

    // Final replacements
    text = text.replace(/\u0000\u0001C(\d+)\u0001\u0000/g, (match, index) => { // Highlighted code blocks
        const block = codeBlocks[parseInt(index)], lang = block.lang, escapedCode = escapeHtml(block.code);
        return '<div class="code-wrapper"><pre><code class="hljs language-' + lang + '">' + escapedCode + '</code></pre></div>';
    });
    text = text.replace(/\u0000\u0001I(\d+)\u0001\u0000/g, (match, index) => `<code>${inlineCode[parseInt(index)]}</code>`); // Inline code remove markers
    text = text.replace(/\u0000\u0001E(\d+)\u0001\u0000/g, (match, index) => escapedBlocks[parseInt(index)]); // \escape block\ replace markers
    text = text.replace(/\\_\\_/g, '_'); // Emoji Fixes
    text = text.replace(/\u0000NL<br>/g, "\u0000NL"); // Line Break remove markers 1
    text = text.replace(/\u0000NL/g, ""); // Line break remove markers 2
    text = text.replace(/\u0000\u0003/g, ""); // Line break remove markers 3
    text = text.replace(/\u0000\u0001H(\d+)\u0000/g, (match, i) => safeHtml[parseInt(i)]); // masked links remove markers
    return text;
}

function parseMarkdownLimited(text) {
    // Inline code
    const inlineCode = [];
    text = text.replace(/`([^`]+)`/g, (match, code) => {
        inlineCode.push(code);
        return `\u0000\u0001I${inlineCode.length - 1}\u0001\u0000`;
    });
    // Escaped blocks
    const escapedBlocks = [];
    text = text.replace(/\\(.*?)\\/g, (match, content) => {
        escapedBlocks.push(content);
        return `\u0000\u0001E${escapedBlocks.length - 1}\u0001\u0000`;
    });
    // Emoji replacement
    text = replaceEmojiNames(text, false);
    text = replaceEmojis(text, false);
    // Masked Links
    text = text.replace(/\[([^\[\]]+)\]\(((https?|discord|tel|sms|mailto):\/\/[^\s<>"]+)\)/gi, (match, t) => {
        if (/^(https?|discord|tel|sms|mailto):\/\//i.test(t)) return match;
        return `<span style="color: var(--text-link);">${t}</span>`;
    });
    // Custom markdown
    text = text.replace(/\[\[(.*?)\]\]/g, '<span class="keybind">$1</span>') // Press [[ALT]] + [[F4]] To Unlock Free Robux! (Discord-Style Keys)
        .replace(/{{(.*?)}}/g, '<span class="badge">$1</span>') // Check the {{31}} Notifications you got! (Red badge with white text)
        .replace(/\[([^\]]+)\]{([^}]+)}/g, '<span style="color: $2">$1</span>') // Colored Text
    // Official Discord Markdown
    text = text.replace(/(?:^|\n)-# > (.+?)(?=\n|$)/g, '> $1') // -# > Text (Subtext + Blockquote)
        .replace(/(?:^|\n)-# (.+?)(?=\n|$)/g, '$1') // -# Text (Subtext)
        .replace(/\|\|([^|]+)\|\|/g, '<span class="spoiler">$1</span>') // ||Text|| (Spoiler)
        .replace(/(?:^|\n)#{1,3} (.+?)(?=\n|$)/g, '<strong>$1</strong>') // Convert Headers to Bold
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // **Text** (Bold)
        .replace(/__(.*?)__/g, '<u>$1</u>') // __Text__ (Underline)
        .replace(/\*([^*]+)\*/g, '<em>$1</em>') // Italic (*Text*)
        .replace(/(?<=\s|^)_(?=\S)(.+?)(?<=\S)_(?=\s|$)/g, '<em>$1</em>') // Italic (_Text_)
        .replace(/~~(.*?)~~/g, '<s>$1</s>') // ~~Text~~ (Strikethrough)
    // Replace line breaks with spaces, but ensure proper spacing between markdown elements
    text = text.replace(/[\r\n]+/g, " ");  // Convert all line breaks to spaces
    text = text.replace(/(<\/[^>]+>)(<[^>]+>)/g, '$1 $2'); // Add space between adjacent tags
    text = text.replace(/\s+/g, " ").trim(); // Collapse multiple spaces into one and trim
    // Normal Links
    text = text.replace(/\b((https?|discord|tel|sms|mailto):\/\/[^\s<>"'\]\)]+)/gi, (match) => {
        if (text.includes(`[${match}](`) || text.includes(`](${match})`)) return match;
        let url = match; if (!/\/$/.test(url) && !url.startsWith("file://")) url += '/';
        return `<span style="color: var(--text-link);">${url}</span>`;
    });
    // Final replacements
    text = text.replace(/\u0000\u0001I(\d+)\u0001\u0000/g, (match, index) => `<code>${inlineCode[parseInt(index)]}</code>`); // Inline code remove markers
    text = text.replace(/\u0000\u0001E(\d+)\u0001\u0000/g, (match, index) => escapedBlocks[parseInt(index)]); // \escape block\ replace markers
    text = text.replace(/\\_\\_/g, '_'); // Emoji Fixes
    return text;
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); 
}

// Helper to format time in Discord style (12:34 PM)
const fT = (date, includeSeconds = false) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return includeSeconds ? `${hours}:${minutes}:${seconds} ${ampm}` : `${hours}:${minutes} ${ampm}`;
};

// Helper to format date (November 11, 2024)
const fD = (date) => {
    return `${date.toLocaleString("en-US", { month: "long" })} ${date.getDate()}, ${date.getFullYear()}`;
};

function formatTime(epoch, format) {
    if (epoch+"".length > 10) epoch = epoch/1E3|0;

    const date = new Date(epoch * 1000);
    if (isNaN(date.getTime())) return `<t:${epoch}:${format}>`;
    
    let formatted;
    switch(format) {
        case "t": // Short Time: "3:20 PM"
            formatted = fT(date);
            break;
        case "T": // Long Time: "3:20:00 PM"
            formatted = fT(date, true);
            break;
        case "d": // Short Date: "11/11/2024"
            formatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            break;
        case "D": // Long Date: "November 11, 2024"
            formatted = fD(date);
            break;
        case "f": // Short Date/Time: "November 11, 2024 3:20 PM"
            formatted = `${fD(date)} ${fT(date)}`;
            break;
        case "F": // Long Date/Time: "Monday, November 11, 2024 3:20 PM"
            const weekday = date.toLocaleString("en-US", { weekday: "long" });
            formatted = `${weekday}, ${fD(date)} ${fT(date)}`;
            break;
        case "s": // Short Date/Time Alt: "11/11/2024 3:20 PM"
            formatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${fT(date)}`;
            break;
        case "S": // Long Date/Time Alt: "11/11/2024 3:20:00 PM"
            formatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${fT(date, true)}`;
            break;
        case "R": // Relative time: "a year ago"
            const now = Date.now();
            const diff = now - date.getTime();
            const seconds = Math.floor(Math.abs(diff) / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            const months = Math.floor(days / 30);
            const years = Math.floor(days / 365);
            
            const isFuture = diff < 0;
            const suffix = isFuture ? "" : " ago";
            const prefix = isFuture ? "in " : "";
            
            // Discord uses singular for 1, e.g. "a year ago" not "1 year ago"
            if (years > 1) formatted = `${prefix}${years} years${suffix}`;
            else if (years === 1) formatted = `${prefix}a year${suffix}`;
            else if (months > 1) formatted = `${prefix}${months} months${suffix}`;
            else if (months === 1) formatted = `${prefix}a month${suffix}`;
            else if (days > 1) formatted = `${prefix}${days} days${suffix}`;
            else if (days === 1) formatted = `${prefix}a day${suffix}`;
            else if (hours > 1) formatted = `${prefix}${hours} hours${suffix}`;
            else if (hours === 1) formatted = `${prefix}an hour${suffix}`;
            else if (minutes > 1) formatted = `${prefix}${minutes} minutes${suffix}`;
            else if (minutes === 1) formatted = `${prefix}a minute${suffix}`;
            else if (seconds > 0) formatted = `${prefix}${seconds} seconds${suffix}`;
            break;
        default: formatted = fD(date) + " " + fT(date);
    }

    return formatted;
}

function formatTimestampElement(element) {
    const epoch = parseInt(element.dataset.epoch);
    const format = element.dataset.format || "f";
    const date = new Date(epoch * 1000);

    element.textContent = formatTime(epoch, format);
    element.title = `${date.toLocaleString("en-US", { weekday: "long" })}, ${fD(date)} ${fT(date, true)}`;
}

function initializeTimestamps() {
    document.querySelectorAll(".relativeTimestamp[data-epoch]").forEach(formatTimestampElement);
    const intervalId = setInterval(() => {document.querySelectorAll(".relativeTimestamp[data-relative='true']").forEach(formatTimestampElement);}, 1000);
    return () => clearInterval(intervalId);
}

// missing:
/*
- lists
  1. also lists
  2. 3. they can also be inline provided they are at the start
  * and also bullet point markers
  - like this
- emails <_@_._> => mailto:_@_._ (you cannot have a space as that breaks the markdown)
- phone numbers <+\d{2,}>
- >>>... multi-line quotes
- real-time timestamps <t:EPOCH:R>
- <@user_id> (shorthand: @username)
- <#channel_id> (shorthand: #channel-name)
- <id:1:2>
- <@&role_id>
- <@$game>
- </command_name:command_id>
- <:custom_emoji:emoji_id>
- <a:animated_custom_emoji:emoji_id>
- <sound:server_id:sound_id>
- @silent
- \ (escape)
- probably some more
*/
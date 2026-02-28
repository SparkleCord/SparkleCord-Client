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
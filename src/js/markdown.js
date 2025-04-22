function parseMarkdown(text) {
    // Code blocks
    const codeBlocks = [];
    text = text.replace(/```(\w*)\n([\s\S]+?)\n```/g, (match, lang, code) => {
        codeBlocks.push({ lang: lang.toLowerCase() || 'plaintext', code: code.trim() });
        return `\u0000\u0001C${codeBlocks.length - 1}\u0001\u0000`;
    });

    // Inline code
    const inlineCode = [];
    text = text.replace(/`([^`]+)`/g, (match, code) => {
        inlineCode.push(code);
        return `\u0000\u0001I${inlineCode.length - 1}\u0001\u0000`;
    });

    // Headers
    text = text.replace(/(?:^|\n)# (.+?)(?=\n|$)/g, '<h1>$1</h1>') // h1 header (# text)
        .replace(/(?:^|\n)## (.+?)(?=\n|$)/g, '<h2>$1</h2>') // h2 header (## text)
        .replace(/(?:^|\n)### (.+?)(?=\n|$)/g, '<h3>$1</h3>'); // h3 header (### text)

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
    text = text.replace(/\[([^\[\]]+)\]\(((https?|ftp|file):\/\/[^\s<>"]+)\)/gi, (match, t, url, protocol) => {
        if (/^(https?|ftp|file):\/\//i.test(t)) return match;
        if (!/\/$/.test(url) && protocol !== 'file') url += '/';
        const anchor = `<a href="${url}" class="link" target="_blank" title="${t.replace(/\r?\n/g, ' ')}\n\n(${url})">${t}</a>`;
        safeHtml.push(anchor);
        return `\u0000\u0001H${safeHtml.length - 1}\u0000`;
    });

    // Custom markdown
    text = text.replace(/\[\[(.*?)\]\]/g, '<span class="keybind">$1</span>') // Press [[ALT]] + [[F4]] To Unlock Free Robux! (Discord-style Keys)
        .replace(/{{(.*?)}}/g, '<span class="badge">$1</span>') // Check the {{31}} Notifications you got! (Red badge with white text)
        .replace(/\[([^\]]+)\]{([^}]+)}/g, '<span style="color: $2">$1</span>') // Colored Text
        .replace(/#([^#]+)#/g, '<span style="font-family: var(--font-headline);">$1</span>') // #Text# (Headline)

    // Official Discord Markdown
    text = text.replace(/(?:^|\n)-# > (.+?)(?=\n|$)/g, '<subtext><blockquote>$1</blockquote></subtext>') // -# > Text (Subtext + Blockquote)
        .replace(/(?:^|\n)-# (.+?)(?=\n|$)/g, '<subtext>$1</subtext>') // -# Text (Subtext)
        .replace(/\|\|([^|]+)\|\|/g, '<span class="spoiler">$1</span>') // ||Text|| (Spoiler)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // **Text** (Bold)
        .replace(/__(.*?)__/g, '<u>$1</u>') // __Text__ (Underline)
        .replace(/\*([^*]+)\*/g, '<em>$1</em>') // Italic (*Text*)
        .replace(/(?<=\s|^)_(?=\S)(.+?)(?<=\S)_(?=\s|$)/g, '<em>$1</em>') // Italic (_Text_)
        .replace(/~~(.*?)~~/g, '<s>$1</s>') // ~~Text~~ (Strikethrough)
        .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>\u0000\u0003'); // > Text (Blockquote)
    text = text.replace(/\n/g, "<br>").replace(/(<\/h[1-3]>|<\/blockquote>|<br>)\s*<br>/g, '$1');  // Line breaks

    // Normal Links
    text = text.replace(/\b((https?|ftp|file):\/\/[^\s<>"'\]\)]+)/gi, (match) => {
        if (text.includes(`[${match}](`) || text.includes(`](${match})`)) return match;
        let url = match;
        if (!/\/$/.test(url) && !url.startsWith("file://")) url += '/';
        return `<a href="${url}" class="link" target="_blank" title="${url}">${url}</a>`;
    });
    // Final replacements
    text = text.replace(/\u0000\u0001C(\d+)\u0001\u0000/g, (match, index) => {
        const block = codeBlocks[parseInt(index)], lang = block.lang, escapedCode = escapeHtml(block.code);
        return '<div class="code-wrapper"><pre><code class="hljs language-' + lang + '">' + escapedCode + '</code></pre></div>';
    }); // Highlighted code blocks
    text = text.replace(/\u0000\u0001I(\d+)\u0001\u0000/g, (match, index) => `<code>${inlineCode[parseInt(index)]}</code>`); // Inline code remove markers
    text = text.replace(/\u0000\u0001E(\d+)\u0001\u0000/g, (match, index) => escapedBlocks[parseInt(index)]); // \escape block\ replace markers
    text = text.replace(/\\_\\_/g, '_'); // Emoji Fixes
    text = text.replace(/\u0000NL<br>/g, "\u0000NL"); // Line Break remove markers 1
    text = text.replace(/\u0000NL/g, ""); // Line break remove markers 2
    text = text.replace(/\u0000\u0003/g, ''); // Line break remove markers 3
    text = text.replace(/\u0000\u0001H(\d+)\u0000/g, (match, i) => safeHtml[parseInt(i)]); // masked links remove markers
    return text;
}

function parseReplyMarkdown(text) {
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
    text = text.replace(/\[([^\[\]]+)\]\(((https?|ftp|file):\/\/[^\s<>"]+)\)/gi, (match, t) => {
        if (/^(https?|ftp|file):\/\//i.test(t)) return match;
        return `<span style="color: var(--text-link);">${t}</span>`;
    });
    // Custom markdown
    text = text.replace(/\[\[(.*?)\]\]/g, '<span class="keybind">$1</span>') // Press [[ALT]] + [[F4]] To Unlock Free Robux! (Discord-Style Keys)
        .replace(/{{(.*?)}}/g, '<span class="badge">$1</span>') // Check the {{31}} Notifications you got! (Red badge with white text)
        .replace(/\[([^\]]+)\]{([^}]+)}/g, '<span style="color: $2">$1</span>') // Colored Text
        .replace(/#([^#]+)#/g, '<span style="font-family: var(--font-headline);">$1</span>') // #Text# (Headline)
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
    text = text.replace(/\n/g, "<br>").replace(/(<\/h[1-3]>|<\/blockquote>|<br>)\s*<br>/g, '$1');  // Line breaks
    // Normal Links
    text = text.replace(/\b((https?|ftp|file):\/\/[^\s<>"'\]\)]+)/gi, (match) => {
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

function escapeHtml(text) { return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"); }
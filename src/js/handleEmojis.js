function showHoverTooltip(event, emojiName) {
    let tooltip = document.getElementById("hover-tooltip-emoji");
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "hover-tooltip-emoji";
        tooltip.className = `tooltip tooltip-bottom`;
        document.body.appendChild(tooltip);
    }

    const rect = event.target.getBoundingClientRect();
    tooltip.innerHTML = `<span>:${emojiName}:</span><br><subtext>Click to learn more</subtext>`;
    tooltip.style = `display: block; left: ${rect.left + rect.width / 2}px; top: ${rect.top}px; transform: translate(-50%, -100%);`
}

function hideHoverTooltip() {
    const tooltip = document.getElementById("hover-tooltip-emoji");
    if (tooltip) tooltip.style.display = "none";
}

function showClickTooltip(event, emojiName, emojiCode, emojiURL) {
    let tooltip = document.getElementById("click-tooltip-emoji");
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "click-tooltip-emoji";
        tooltip.className = "click-tooltip-emoji"; document.body.appendChild(tooltip);
    }

    const emoji = emojiUtils.getEmoji(emojiCode.split("-"));
    const src = emojiURL ?? `./emoji/${emoji.path ?? `${emojiCode}.svg`}`;
    tooltip.innerHTML = `<img src="${src}">
      <div>
          <span class="emojiName">:${emojiName}:</span>
          <br>
          <span class="emojiDesc">${
              !emojiCode.replace(/\w{17,19}/, "")
                ? "This emoji is from a Discord server."
                : emoji.path && emoji.path.startsWith("custom/")
                    ? "You've discovered a community emoji! <br><br><em><b>This is a development build-only feature.</b></em>"
                    : defaultEmojiDesc
          }</span>
      </div>`;

    const rect = event.currentTarget.getBoundingClientRect();
    tooltip.style = `display: flex; left: ${rect.right + 10}px; top: ${rect.top}px; position: absolute; z-index: 9999;`;
    event.stopPropagation();

    function hideTooltip(e) {
        if (!tooltip.contains(e.target)) {
            tooltip.style.display = "none"; document.removeEventListener("click", hideTooltip);
        }
    }

    setTimeout(() => document.addEventListener("click", hideTooltip), 50);
}

class EmojiUtils {
    constructor(emojiData) {
        this.emojiData = emojiData;
        this.diversityMap = {
            "1f3fb": "skin-tone-1", "1f3fc": "skin-tone-2", "1f3fd": "skin-tone-3",
            "1f3fe": "skin-tone-4", "1f3ff": "skin-tone-5"
        };

        this.textChars = new Set(["™", "®", "©", "™️", "®️", "©️", "🐻‍❄"]);
        this.emojiMap = this.buildEmojiMap();

        const EMOJI_RANGE = /(?:[\u{1F3FB}-\u{1F3FF}]\u{E621})|(?:[\u{1F3FB}-\u{1F3FF}])|(?:[\u{E100}-\u{E9FF}])(?:[\u{1F3FB}-\u{1F3FF}])?|(?:\p{Extended_Pictographic}(?:\uFE0F)?(?:[\u{1F3FB}-\u{1F3FF}])?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F)?(?:[\u{1F3FB}-\u{1F3FF}])?)*)|(?:[0-9#*]\uFE0F?\u20E3)|(?:[\u{1F1E6}-\u{1F1FF}]{1,2})|[\u2122\u00AE\u00A9]\uFE0F?/gu;
        
        const DISCORD_EMOJI_RANGE = /<(a)?:(\w+):(\d+)>/g;

        this.EMOJI_REGEXP = new RegExp(EMOJI_RANGE.source, "gu");
        this.SINGLE_EMOJI_REGEXP = new RegExp(`^(?:${EMOJI_RANGE.source})+$`, "u");

        this.CEMOJI_REGEXP = new RegExp(DISCORD_EMOJI_RANGE.source, "gu");
        this.SINGLE_CEMOJI_REGEXP = new RegExp(`^(?:${DISCORD_EMOJI_RANGE.source})+$`, "u");
    }

    buildEmojiMap() {
        const map = new Map();
        Object.values(this.emojiData).forEach(category => {
            category.forEach(emoji => {
                emoji.surrogates = emoji.surrogates;
                emoji.names.forEach(name => map.set(name, emoji));
                if (emoji.diversityChildren) {
                    emoji.diversityChildren.forEach(child => {
                        child.surrogates = child.surrogates;
                        child.names.forEach(name => map.set(name, child));
                    });
                }
            });
        });

        return map;
    }

    replaceEmojiNames(text, inCodeBlock = false) {
        // return "🐱";
        if (inCodeBlock) return text;
        return text.replace(/:([^:\s]+)(?:::skin-tone-\d)?:/g, (match, name) => {
            const emoji = this.emojiMap.get(name);
            return emoji ? emoji.surrogates : match;
        });
    }

    findChar(chars, code) {
        return chars.some(c => c.codePointAt(0).toString(16) === code);
    }

    filterCodes(code, chars) {
        switch (code) {
            case "fe0f":
                const isPolarBear = (this.findChar(chars, "1f43b") && this.findChar(chars, "2744"));
                const isZWJSequence = this.findChar(chars, "200d");
                const isGenderSequence = this.findChar(chars, "2640") || this.findChar(chars, "2642");
                const isProfession = this.findChar(chars, "2695") || this.findChar(chars, "2696") || this.findChar(chars, "2708");

                return isPolarBear || isZWJSequence || isGenderSequence || isProfession;
            case "200d": return true;
            default: return true;
        }
    }

    replaceEmojis(text, inCodeBlock = false, forceSmall = false) {
        if (inCodeBlock) return text;

        // emoji counter
        let emojiCount = 0;
        text.replace(this.EMOJI_REGEXP, (match) => { if (!this.textChars.has(match)) emojiCount++; return match; });
        text.replace(this.CEMOJI_REGEXP, (match) => { emojiCount++; return match; });

        // size does matter
        const isOnlyEmoji = Parser.trim(text.trim().replace(this.CEMOJI_REGEXP, "").replace(this.EMOJI_REGEXP, "").replace(/[\s<br>]+/gu, "")).length === 0 && emojiCount > 0;
        
        let sizeClass;
        if (forceSmall) {
            sizeClass = "emoji-uninteractable";
        } else {
            sizeClass = (!isOnlyEmoji || emojiCount > 30) ? "emoji-tiny" : "emoji";
        }


        // discord html replacement
        const withDiscordEmojis = text.replace(this.CEMOJI_REGEXP, (match, animated, name, id) => {
            const isAnimated = animated === "a";
            const extension = isAnimated ? "gif" : "png";
            const SRC = `https://cdn.discordapp.com/emojis/${id}.${extension}`;

            return `<span class="emoji-wrapper"><img src="${SRC}" alt="${match}" class="${sizeClass}" draggable="false" onclick="showClickTooltip(event,'${name}','${id}','${SRC}')" onmouseenter="showHoverTooltip(event,'${name}')" onmouseleave='hideHoverTooltip()' onerror="this.parentElement.parentElement.querySelectorAll('.emoji').forEach(e => e.classList.replace('emoji','emoji-tiny')); this.parentElement=this.alt;"/></span>`;
        });

        // html replacement
        return withDiscordEmojis.replace(this.EMOJI_REGEXP, (match) => {
            if (this.textChars.has(match)) return match;

            const chars = Array.from(match);
            const codes = chars.map(char => char.codePointAt(0).toString(16)).filter(code => this.filterCodes(code, chars));
            let emojiCode = codes.join("-");

            const glitchedCodes = ["2640", "2642", "2695", "2708", "2696"];
            if (glitchedCodes.some(code => emojiCode === `${code}-fe0f`)) {
                emojiCode = emojiCode.slice(0,-5);
            }

            if (emojiCode.includes("1faf1") && !emojiCode.startsWith("1faf1")) {
                emojiCode = emojiCode.replace("1faf1", "1faef");
            }

            let SRC = `${emojiCode}.svg`;

            const emojiName = this.getEmojiName(codes).replace(/_/g, "\\_\\_");
            const emoji = this.getEmoji(codes);

            // if they are in the custom block (U+E100-U+E1FF) or have a custom path
            if (emoji.path) SRC = emoji.path;

            return `<span class="emoji-wrapper"><img src="./emoji/${SRC}" alt="${match}" class="${sizeClass}" draggable="false" ${forceSmall ? "" : `onclick="showClickTooltip(event,'${emojiName}','${emojiCode}')" onmouseenter="showHoverTooltip(event,'${emojiName}')" onmouseleave="hideHoverTooltip()"`} onerror="this.parentElement.parentElement.querySelectorAll('.emoji').forEach(e => e.classList.replace('emoji','emoji-tiny')); this.parentElement=this.alt;"/></span>`;
        });
    }

    getEmoji(codes) {
        const fullCode = codes.join("-");
        for (const [name, emoji] of this.emojiMap) {
            const chars = Array.from(emoji.surrogates);
            const emojiCodes = chars.map(char => char.codePointAt(0).toString(16)).filter(code => this.filterCodes(code, chars));
            if (emojiCodes.join("-") === fullCode) { return emoji; }
        }
        return "unknown";
    }

    getEmojiName(codes) {
        const fullCode = codes.join("-");
        for (const [name, emoji] of this.emojiMap) {
            const chars = Array.from(emoji.surrogates);
            const emojiCodes = chars.map(char => char.codePointAt(0).toString(16)).filter(code => this.filterCodes(code, chars));
            if (emojiCodes.join("-") === fullCode) { return name; }
        }
        return "unknown";
    }

    getEmojiByName(n) {
        for (const [name, emoji] of this.emojiMap) {
            if (name === n) return this.replaceEmojis(emoji.surrogates, false, true);
        }
    }

    getEmojiNameFromIcon(icon) {
        const codes = icon.split("-");
        return this.getEmojiName(codes);
    }
}

const emojiUtils = new EmojiUtils(emojiData);
function replaceEmojiNames(text, inCodeBlock = false) {
    return emojiUtils.replaceEmojiNames(text, inCodeBlock);
}

function replaceEmojis(text, inCodeBlock = false) {
    return emojiUtils.replaceEmojis(text, inCodeBlock);
}
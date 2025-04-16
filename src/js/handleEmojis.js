function showHoverTooltip(event, emojiName) {
    let clickTooltip = document.getElementById("click-tooltip-emoji");
    if (clickTooltip && clickTooltip.style.display === "flex") return;
    let tooltip = document.getElementById("hover-tooltip-emoji");
    if (!tooltip) { tooltip = document.createElement("div"); tooltip.id = "hover-tooltip-emoji"; tooltip.className = "hover-tooltip-emoji"; document.body.appendChild(tooltip); }
    tooltip.innerText = `:${emojiName}:`; 
    tooltip.style.display = "block";
    let rect = event.target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top}px`;
    tooltip.style.transform = "translate(-50%, -100%)";
}
function hideHoverTooltip() { const tooltip = document.getElementById("hover-tooltip-emoji"); if (tooltip) tooltip.style.display = "none"; }
function showClickTooltip(event, emojiName, emojiCode) {
    let tooltip = document.getElementById("click-tooltip-emoji");
    if (!tooltip) { tooltip = document.createElement("div"); tooltip.id = "click-tooltip-emoji"; tooltip.className = "click-tooltip-emoji"; document.body.appendChild(tooltip); }
    tooltip.innerHTML=`<img src="./emoji/${emojiCode}.svg">
        <div>
            <span class="emojiName">:${emojiName}:</span>
            <br>
            <span class="emojiDesc">${defaultEmojiDesc}</span>
        </div>`;
    tooltip.style.display = "flex";
    let rect = event.currentTarget.getBoundingClientRect();
    tooltip.style.left = `${rect.right + 10}px`;
    tooltip.style.top = `${rect.top}px`;
    tooltip.style.position = "absolute";
    tooltip.style.zIndex = "9999";
    event.stopPropagation();
    function hideTooltip(e) { if (!tooltip.contains(e.target)) { tooltip.style.display = "none"; document.removeEventListener("click", hideTooltip); } }
    setTimeout(() => document.addEventListener("click", hideTooltip), 50);
}
class EmojiUtils {
  constructor(emojiData) {
    this.emojiData = emojiData;
    this.diversityMap = {
      '1f3fb': 'skin-tone-1', '1f3fc': 'skin-tone-2', '1f3fd': 'skin-tone-3',
      '1f3fe': 'skin-tone-4', '1f3ff': 'skin-tone-5'
    };
    this.knownEmojis = {
      '2122': 'tm', '00ae': 'registered', '00a9': 'copyright',
      '26a7': 'transgender_symbol', '1f3cc': 'person_golfing',
      '2640': 'female_sign', '2642': 'male_sign',
      '1f46f': 'people_with_bunny_ears_partying',
      '2620': 'skull_and_crossbones', '1f3f3': 'white_flag',
      '1f308': 'rainbow', '270b': 'raised_hand', '261d': 'point_up',
      '270a': 'fist', '1f473': 'person_wearing_turban',
      '1f46e': 'police_officer', '2328': 'keyboard',
      '23f1': 'stopwatch', '23f2': 'timer_clock',
      '23f0': 'alarm_clock', '1f570': 'mantelpiece_clock',
      '231b': 'hourglass', '23f3': 'hourglass_flowing_sand',
      '1fa85': 'piñata'
    };
    this.ZWJ = '\u200D';
    this.VS16 = '\uFE0F';
    this.textChars = new Set(['™', '®', '©', '™️', '®️', '©️']);
    this.emojiMap = this.buildEmojiMap();
  }
  buildEmojiMap() {
    const map = new Map();
    Object.values(this.emojiData).forEach(category => {
      category.forEach(emoji => {
        emoji.surrogates = this.sanitizeSurrogates(emoji.surrogates);
        emoji.names.forEach(name => map.set(name, emoji));
        if (emoji.diversityChildren) { emoji.diversityChildren.forEach(child => {
            child.surrogates = this.sanitizeSurrogates(child.surrogates);
            child.names.forEach(name => map.set(name, child));
          });
        }
      });
    });
    return map;
  }
  sanitizeSurrogates(surrogates) { 
    return decodeURIComponent(encodeURIComponent(surrogates))
      .replace(/â€/g, '\u200D').replace(/ï¸/g, '\uFE0F')
      .replace(/â™€/g, '\u2640').replace(/â™‚/g, '\u2642')
      .replace(/âš§/g, '\u26A7').replace(/â˜ /g, '\u2620')
      .replace(/âŒ¨/g, '\u2328').replace(/â±/g, '\u23F1')
      .replace(/â²/g, '\u23F2').replace(/â°/g, '\u23F0')
      .replace(/âŒ›/g, '\u231B').replace(/â³/g, '\u23F3')
      .replace(/âœ‹/g, '\u270B').replace(/â˜/g, '\u261D')
      .replace(/âœŠ/g, '\u270A').replace(/â„¢/g, '\u2122')
      .replace(/Â®/g, '\u00AE').replace(/Â©/g, '\u00A9')
      .replace(/ðŸ³/g, '\u1F3F3').replace(/ðŸŒˆ/g, '\u1F308')
      .replace(/ðŸ¤¼/g, '\u1F93C').replace(/ðŸ¯/g, '\u1F46F')
      .replace(/ðŸ´/g, '\u1F3F4').replace(/ðŸ³/g, '\u1F3F3')
      .replace(/âš /g, '\u2620').normalize('NFC');
  }
  replaceEmojiNames(text, inCodeBlock = false) { 
    if (inCodeBlock) return text;
    return text.replace(/:([^:\s]+)(?:::skin-tone-\d)?:/g, (match, name) => {
      const emoji = this.emojiMap.get(name);
      return emoji ? emoji.surrogates : match;
    });
  }
  replaceEmojis(text, inCodeBlock = false) {
    if (inCodeBlock) return text;
    return text.replace(/(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(?:[\u200D\uFE0F\u{1F3FB}-\u{1F3FF}\u2640\u2642]|\u200D(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F))*|(?:[\u2122\u00AE\u00A9][\uFE0F]?)/gu,
      (match) => {
        if (this.textChars.has(match)) return match;
        const chars = Array.from(match);
        const codes = chars.map(char => char.codePointAt(0).toString(16).padStart(4, '0')).filter(code => code !== 'fe0f');
        const emojiCode = codes.join('-');
        const emojiName = this.getEmojiName(codes).replace(/_/g, '\\_\\_');
        const isOnlyEmoji = text.trim().replace(/[\s<br>]+/gu, '').match(/^(?:[\p{Emoji}\uFE0F\u200D]+)$/u);
        const sizeClass = isOnlyEmoji ? "emoji" : "emoji-tiny";
        return `<span class="emoji-wrapper"><img src="./emoji/${emojiCode}.svg" alt="${match}" class="${sizeClass}" draggable="false" onclick="showClickTooltip(event,'${emojiName}','${emojiCode}')" onmouseenter="showHoverTooltip(event,'${emojiName}')" onmouseleave="hideHoverTooltip()" onerror="this.outerHTML=this.alt"/></span>`;
      }
    );
  }
  getEmojiName(codes) {
    if (codes.length === 1 && this.knownEmojis[codes[0]]) { return this.knownEmojis[codes[0]]; }
    if (codes.length === 2 && this.knownEmojis[codes[0]]) {
      const baseName = this.knownEmojis[codes[0]];
      const toneCode = codes[1];
      if (this.diversityMap[toneCode]) { return `${baseName}_tone${parseInt(this.diversityMap[toneCode].slice(-1))}`; }
    }
    const fullCode = codes.join('-');
    for (const [name, emoji] of this.emojiMap) {
      const emojiCodes = Array.from(emoji.surrogates).map(char => char.codePointAt(0).toString(16).padStart(4, '0')).filter(code => code !== 'fe0f');
      if (emojiCodes.join('-') === fullCode) { return name; }
    }
    return 'unknown';
  }
  getEmojiNameFromIcon(icon) { const codes = icon.split('-'); return this.getEmojiName(codes); }
}
const emojiUtils = new EmojiUtils(emojiData);
function replaceEmojiNames(text, inCodeBlock = false) { return emojiUtils.replaceEmojiNames(text, inCodeBlock); }
function replaceEmojis(text, inCodeBlock = false) { return emojiUtils.replaceEmojis(text, inCodeBlock); }
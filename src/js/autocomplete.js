class AutoComplete {
    constructor(input, mentions, emojiUtils, commands) {
        this.input = input;
        this.mentions = mentions;
        this.emojiUtils = emojiUtils;
        this.commands = commands;
        this.types = { 
            mentions: query => this.filterMentions(query), 
            emoji: query => this.filterEmojis(query), 
            commands: query => this.filterCommands(query) 
        };
        this.suggestionsDiv = Object.assign(document.createElement("div"), { className: "autocomplete" });
        document.getElementById("message-input").insertBefore(this.suggestionsDiv, this.suggestionsDiv.firstChild);
        input.addEventListener("input", event => this.onInput(event));
        input.addEventListener("keydown", event => this.onKeyDown(event));
        input.addEventListener("blur", event => { 
            if (!this.suggestionsDiv.contains(event.relatedTarget)) setTimeout(() => this.hide(), 100); 
        });
        this.suggestionsDiv.addEventListener("mousedown", event => event.preventDefault());
        input.addEventListener("focus", () => this.onInput({ target: input }));
        this.selectedIndex = this.shouldAutoselect() ? 0 : -1;
    }    
    onInput(event) {
        const inputValue = event.target.value, 
              mentionMatch = inputValue.match(/@(\w*)$/), 
              emojiMatch = inputValue.match(/:(\w+)$/), 
              commandMatch = inputValue.match(/\/(\w*)$/);
        mentionMatch ? this.show("mentions", this.types.mentions(mentionMatch[1])) 
        : emojiMatch ? this.show("emoji", this.types.emoji(emojiMatch[1])) 
        : commandMatch ? this.show("commands", this.types.commands(commandMatch[1])) 
        : this.hide();
    }
    fuzzyMatchScore(str, query) {
        let score = 0, index = 0;
        for (let char of query) { index = str.indexOf(char, index); if (index === -1) return 0; score += 1 / (index + 1); }
        return score;
    }
    fuzzyMatch(list, query) {
        if (!query) return list.slice(0, 10);
        return list.map(item => ({ item, score: this.fuzzyMatchScore(item, query) }))
            .filter(entry => entry.score > 0).sort((a, b) => b.score - a.score).map(entry => entry.item).slice(0, 10);
    }
    filterMentions(query) {
        const normalize = str => str.toLowerCase().replace(/[^a-z0-9]/g, ""),
              results = Object.keys(this.mentions).filter(name => normalize(name).includes(normalize(query)));
        if (normalize(profile.username).includes(normalize(query)) && !results.includes(`@${profile.name}`)) results.unshift(`@${profile.name}`);
        const specialMentions = ["@everyone", "@here"],
              normalItems = results.filter(item => !specialMentions.includes(item)),
              specialItems = results.filter(item => specialMentions.includes(item));
        return [...this.fuzzyMatch(normalItems, query), ...specialItems].slice(0, 10);
    }
    filterEmojis(query) {
        if (!query) return [];
        const seen = new Set(), results = [];
        [...this.emojiUtils.emojiMap.values()].forEach(emoji => { 
            if (!/🏻|🏼|🏽|🏾|🏿|_tone\d/.test(emoji.surrogates) && emoji.names.some(name => name.includes(query)) && !seen.has(emoji.names[0])) 
                seen.add(emoji.names[0]), results.push(emoji.names[0]); 
        });
        Object.entries(this.emojiUtils.AC_Emojis || {}).forEach(([alias, emoji]) => { 
            if (alias.includes(query) && !seen.has(emoji)) seen.add(emoji), results.push(emoji); 
        });
        return this.fuzzyMatch(results, query);
    }
    filterCommands(query) {
        return this.fuzzyMatch(this.commands.map(command => `/${command.name}`), query);
    }    
    shouldAutoselect() {
        return JSON.parse(localStorage.getItem('autoselect-in-autocomplete') || "false");
    }
    insertSuggestion(type, value) { 
        this.input.value = this.input.value.replace(/[@:\/]\w*$/, 
            type === "emoji" ? `:${value}: ` 
            : type === "commands" ? `/${value} ` 
            : `${value} `); 
        this.hide(); 
        this.input.focus(); 
    }
    appendSuggestion(item, type, isSelected) {
        const div = Object.assign(document.createElement("div"), { 
            className: `suggestion-item${isSelected ? " selected" : ""}`, 
            innerHTML: `
                <span>${type === "emoji" ? `:${item}:` : item}</span>
                ${type === "commands" ? `<span class="description">${this.commands.find(command => `/${command.name}` === item)?.description || ""}</span>` 
                : this.mentions[item] ? `<span class="description">${this.mentions[item]}</span>` 
                : ""}` 
        });
        div.addEventListener("click", () => this.insertSuggestion(type, item.replace("/", "")));
        this.suggestionsDiv.appendChild(div);
    }
    updateSelection() {
        const items = this.suggestionsDiv.querySelectorAll(".suggestion-item");
        items.forEach((item, index) => item.classList.toggle("selected", index === this.selectedIndex));
    }
    onKeyDown(event) {
        if (this.suggestionsDiv.classList.contains("show") || !this.shouldAutoselect()) return;
        const items = this.suggestionsDiv.querySelectorAll(".suggestion-item");
        if (event.key === "ArrowDown") {
            this.selectedIndex = (this.selectedIndex + 1) % items.length;
            this.updateSelection();
            event.preventDefault();
        } else if (event.key === "ArrowUp") {
            this.selectedIndex = (this.selectedIndex - 1 + items.length) % items.length;
            this.updateSelection();
            event.preventDefault();
        } else if (event.key === "Enter") {
            if (items[this.selectedIndex]) items[this.selectedIndex].click();
            event.preventDefault();
        }
    }
    show(type, items) {
        if (!items.length) return this.hide();
        this.suggestionsDiv.innerHTML = 
        `<div class="header">${type === "emoji" ? `Emojis matching :${this.input.value.match(/:(\w+)$/)[1]}` 
        : type === "mentions" ? `Mentions matching @${this.input.value.match(/@(\w*)$/)[1]}` 
        : `Commands matching /${this.input.value.match(/\/(\w*)$/)[1]}`}</div>`;
        this.suggestionsDiv.style.visibility = "visible"; this.suggestionsDiv.style.pointerEvents = "auto"; this.suggestionsDiv.classList.add("show");
        const specialMentions = ["@everyone", "@here"], 
              normalItems = items.filter(item => !specialMentions.includes(item)), 
              specialItems = items.filter(item => specialMentions.includes(item));
        normalItems.forEach((item, index) => this.appendSuggestion(item, type, this.shouldAutoselect() && index === 0));
        if (normalItems.length && specialItems.length) this.suggestionsDiv.appendChild(Object.assign(document.createElement("div"), { className: "separator" }));
        specialItems.forEach((item, index) => this.appendSuggestion(item, type, this.shouldAutoselect() && !normalItems.length && index === 0));
        this.selectedIndex = this.shouldAutoselect() ? 0 : -1;
        this.updateSelection();
    }
    hide() {
        if (!this.suggestionsDiv.classList.contains("show")) return;
        this.suggestionsDiv.classList.add("hiding");
        setTimeout(() => {
            this.suggestionsDiv.classList.remove("show", "hiding"); this.suggestionsDiv.style.visibility = "hidden"; this.suggestionsDiv.style.pointerEvents = "none";
        }, 75);
    }
}
const mentions = { 
    "@everyone": "Notify everyone who has permission to view this channel.", 
    "@here": "Notify everyone online who has permission to view this channel.", 
    [`@${profile.name}`]: profile.username 
};
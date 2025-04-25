// Custom Conditions
window.CONDITION_Mobile = window.innerWidth < 768;
window.addEventListener('resize', () => {
    window.CONDITION_Mobile = window.innerWidth < 768;
});
setInterval(() => {
    document.querySelectorAll("[data-hidecondition]").forEach(el => {
        const condition = window[el.dataset.hidecondition];
       // console.log(`[${el.dataset.hidecondition}] =`, condition); // For Debugging
        el.style.display = condition ? "none" : "";
    });
}, 100);
// Custom Conditions - End

// Loading and initializing the settings
const settingsData = {
    "User Settings": {
        profile: { 
            name: "Profile",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-pen-icon lucide-user-pen"><path d="M11.5 15H7a4 4 0 0 0-4 4v2"/><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><circle cx="10" cy="7" r="4"/></svg>`,
            options: [
                { label: "Global Name", type: "text", id: "global-name-input" },
                { label: "Username", type: "text", id: "username-input" },
                { label: "Status Text", type: "text", id: "status-input" },
                { 
                    label: "Avatar", type: "file", id: "avatar-input", accept: "image/*",
                    changeLabel: "Change Avatar", removeLabel: "Remove Avatar", containerId: "avatar-btns-container"
                }
            ], 
            button: { text: "Save Profile", id: "save-profile-btn", onClick: saveProfile }
        },
    },
    
    "__sep__": { },

    "App Settings": {
        appearance: { 
            name: "Appearance", 
            options: [
                { label: "Pick your Theme", type: "info-title" },
                { type: "radio", id: "theme-picker",
                    buttons: [
                        { name: "Light", id: "theme-light", onClick: () => setTheme('light') },
                        { name: "Dark", id: "theme-dark", onClick: () => setTheme('dark'), default: "true" },
                        { name: "Darker", id: "theme-darker", onClick: () => setTheme('darker') },
                        { name: "Midnight", id: "theme-midnight", onClick: () => setTheme('midnight') },
                        { name: "Sync With System", id: "theme-system", onClick: () => setTheme('system') },
                    ]
                },
                { label: "Enable Visual Refresh", type: "toggle", id: "refresh-toggle", onToggle: toggleRefresh, defaultState: "off",
                    description: "Enables the Visual Refresh theme from Discord."
                },
                { label: "Client theme", type: "info-title" },
                { label: "Enable Client Theme", type: "toggle", id: "clientTheme-toggle", onToggle: toggleClientTheme, defaultState: "off",
                    description: "Enables the old client theme experiment from Discord. (inspo. from TheUpgrater & Vencord)"
                },
                { id: "theme-color", type: "color", onColorSelect: changeClientTheme },
                { 
                    label: `This <strong>only</strong> works on the following themes:
                    <br>- Dark without Visual Refresh
                    <br>- Dark with Visual Refresh
                    <br>- Light with Visual Refresh
                    <br>Your UserCSS styles will still work.`,
                    type: "info-warning", style: "margin-top: -10px;" },
            ]
        },
        chat: {
            name: "Chat",
            options: [
                { label: "Show Send Message Button", type: "toggle", id: "send-btn-toggle", onToggle: toggleSendButton, defaultState: "on", hideIf: "CONDITION_Mobile" },
            ]
        },
        utility: {
            name: "Utility",
            options: [
                { label: "Automatically convert emoticons in your messages to emoji", type: "toggle", id: "auto-convert-emoticons", onToggle: toggleEmoticonConversion, 
                    defaultState: "off",
                    description: "For example, when you type :) SparkleCord will convert it to :slight_smile:",
                },
                { label: "Automatically select the first autocomplete option", type: "toggle", id: "autocomplete-autoselect", onToggle: toggleAutoselectAutocomplete, 
                    defaultState: "off",
                    description: "Got annoying when testing this so I made it togglable",
                },
            ]
        },
        automod: {
            name: "AutoMod",
            options: [
                { label: "Choose Your Words", type: "text", id: "automod-text-input", multiline: true },
                { label:"Separate words or phrases with a comma (dog, cat, tiger) or new line. Use * at the beginning, end, or both for partial matching.", type: "info", style: "margin-top: -10px;" },

                { label: "Blocked Regex Patterns", type: "text", id: "automod-regex-input", multiline: true },
                { label: "Regex patterns must follow proper syntax. Invalid patterns may be ignored.", type: "info", style: "margin-top: -10px;" },
        
                { label: "Exceptions", type: "text", id: "automod-exceptions-input", multiline: true },
                { label: "Words or phrases here will not be blocked, even if they match blocked content or regex.", type: "info", style: "margin-top: -10px;" },
                { label: "You cannot use this to override the *System* AutoMod, only the *User* one.", type: "info", style: "margin-top: -20px;" },
            ],
            button: { text: "Save AutoMod Rules", id: "save-automod-settings", onClick: saveAutomodSettings }
        }        
    },
    
    "__sep__ 2": { },

    "Custom Settings": {
        ai: {
            name: "AI Settings",
            options: [
                { 
                    label: "Enable Sparkly AI", 
                    type: "toggle", 
                    id: "sparkly-toggle", 
                    onToggle: toggleSparkly, 
                    defaultState: "off",
                    description: "Enables Sparkly AI from old SparkleCord, Keep in mind this is **__experimental__**, Things may break."
                },
                { 
                    label: "Enable Markov Chain", 
                    type: "toggle", 
                    id: "sparkly-markov-toggle", 
                    onToggle: toggleSparklyMarkov, 
                    defaultState: "on",
                    description: "Enables the Markov Chain instead of the API, This will be much dumber, but works offline.",
                    dependsOn: "sparkly-toggle"
                },
                { label: "API Key", type: "text", id: "apikey-input" },
                { label: "Model", type: "text", id: "model-input" },
            ],
            button: { text: "Save Settings", id: "save-ai-settings", onClick: saveAISettings }
        },
        loading: {
            name: "Loading",
            options: [
                { label: "Loading Line", type: "text", id: "line-input" },
                { label: "Use Custom Loading Line", type: "toggle", id: "custom-line", onToggle: toggleLoadingLine, defaultState: "off", description: `Uses the custom loading line you set above instead of SparkleCord default, for Example: "The app is loading :o". ` },
            ],
            button: { text: "Save Settings", id: "save-loading-settings", onClick: saveLoadingSettings }
        },
        css: {
            name: "UserCSS",
            options: [
                { text: "Open Editor", id: "open-ucss-editor", type: "btn", onClick: openEditor, buttonType: "brand" },
                { label: "Use UserCSS", type: "toggle", id: "usercss-toggle", onToggle: toggleUserCSS, defaultState: "off", 
                    description: `Use the CSS styles from the editor.` 
                },
            ],
        },
    },

    "__sep__ 3": {
        demos: { 
            name: "Demos",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3"/><path d="m16 2 6 6"/><path d="M12 16H4"/></svg>`,
            options: [
                { label: "Custom Options", type: "info-title" },
                {
                    type: "custom", 
                    id: "custom-option", 
                    html: `<code>hello everyone this is your daily dose of geometry dash</code>`
                },
                { label: "Toggle Options", type: "info-title" },
                {
                    label: "Depends (PARENT)", 
                    type: "toggle", 
                    id: "example-depends-parent", 
                    onToggle: toggleSecretSetting, 
                    defaultState: "off",
                    description: "Keep in mind this is **__experimental__**, Things may break."
                },
                {
                    label: "Depends (CHILD)", 
                    type: "toggle", 
                    id: "example-depends-child", 
                    onToggle: toggleSecretSetting, 
                    defaultState: "off",
                    description: "Keep in mind this is **__experimental__**, Things may break.",
                    dependsOn: "example-depends-parent"
                },
                {
                    label: "Disabled (Wihthout Depends)", 
                    type: "toggle", 
                    id: "disabled-option", 
                    onToggle: toggleSecretSetting, 
                    defaultState: "off",
                    description: "Yes...",
                    disabled: true
                },
                { label: "Other Options", type: "info-title" },
                { 
                    label: "Experimental Option", 
                    type: "toggle", 
                    id: "experimental-option", 
                    onToggle: toggleSecretSetting, 
                    defaultState: "off",
                    description: "Keep in mind this is **__experimental__**, Things may break."
                },
                { label: "Experimenting with new option types", type: "info-title" },
                { label: "Slider", type: "info-title" },
                {
                    type: "slider", 
                    id: "slider-example",
                    onInput: sliderLog
                },
                { label: "Adjust the slider to set the value, it updates as you slide.", type: "info", style: "margin-top: -5px;" },
                { label: "Radio", type: "info-title" },
                {
                    type: "radio", 
                    id: "radio-buttons-example",
                    buttons: [
                        { name: "Auto", id: "ex-r-auto", default: "true" },
                        { name: "720p", id: "ex-r-720p" },
                        { name: "1080p", id: "ex-r-1080p" },
                    ]
                },
                { label: "This is a <code>radiogroup</code>. Only one option can be active at a time.", type: "info", style: "margin-top: -5px;" },
            ]
        }
    },
    "__sep__ 4": { },
};
function createSettingsPanel() {
    const settingsPanel = document.createElement("div"); settingsPanel.id = "settings-panel"; settingsPanel.className = "hidden"; settingsPanel.style.display = "flex";
    settingsPanel.innerHTML = `
        <div id="settings-container">
            <div id="settings-sidebar"></div>
            <div id="settings-content"></div>
            <div id="close-settings-btn_mobile" aria-label="Close" role="button">
                <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z" class=""></path></svg>
            </div>
            <div class="close-container">
                <div id="close-settings-btn" aria-label="Close" role="button">
                    <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z" class=""></path></svg>
                </div>
                <div class="menuKeybind" aria-hidden="true">ESC</div>
            </div>
        </div>
    `;
    $("settings-panel-container").appendChild(settingsPanel);
    settingsPanel.querySelectorAll("[id^='close-settings-btn']").forEach(btn => btn.addEventListener("click", closeSettingsPanel));

    let sidebarHTML = ``, contentHTML = "";

    Object.entries(settingsData).forEach(([category, sections]) => {
        if (category.startsWith("__sep__")) { sidebarHTML += `<div class="separator"></div>`; } else { sidebarHTML += `<div class="eyebrow">${category}</div>`; }            
        Object.entries(sections).forEach(([key, section], index) => {
            sidebarHTML += `<button class="settings-tab" data-tab="${key}-settings">${section.name} ${section.icon ? section.icon : ``}</button>`;
            let optionsHTML = `<h2>${section.name}</h2>`;
            section.options.forEach(opt => {
                if (opt.type === "info") {optionsHTML += `<p class="small-normal" ${opt.style?`style="${opt.style}"`:""}>${opt.label}</p>`;
                } else if (opt.type === "info-title") { optionsHTML += `<p class="eyebrow" style="margin-top: 10px; margin-bottom: -10px;">${opt.label}</p>`;
                } else if (opt.type === "info-warning") { optionsHTML += `<p class="small-danger" ${opt.style?`style="${opt.style}"`:""}>${opt.label}</p>`;
                } else if (opt.type === "toggle") {
                    let isChecked = JSON.parse(localStorage.getItem(opt.id)) ?? (opt.defaultState === "on"), isDisabled = (opt.dependsOn && !(JSON.parse(localStorage.getItem(opt.dependsOn)) ?? false)) || opt.disabled === true;
                    optionsHTML += `<div class="toggle-container${isDisabled ? ' disabled' : ''}" ${opt.hideIf ? `data-hidecondition="${opt.hideIf}"` : ''}>
                            <span class="label-text">${parseMarkdown(opt.label)}</span>
                            <label class="switch">
                                <input type="checkbox" id="${opt.id}"
                                    ${isChecked ? "checked" : ""} ${isDisabled ? "disabled" : ""} ${opt.dependsOn ? `data-depends-on="${opt.dependsOn}"` : ""}
                                    ${opt.disabled ? "data-force-disabled" : ""}>
                                <span class="slider"></span>
                            </label>
                            ${opt.description ? `<p class="small-normal">${parseMarkdown(opt.description)}</p>` : ''}
                        </div>`;
                } else if (opt.type === "custom") {optionsHTML += `${opt.html}`;
                } else if (opt.type === "file" && opt.changeLabel && opt.removeLabel && opt.containerId) {
                    optionsHTML += `<label for="${opt.id}">${opt.label}</label>
                    <input type="file" id="${opt.id}" ${opt.accept ? `accept="${opt.accept}"` : ""} style="display: none;">
                    <div class="buttons" id="${opt.containerId}">
                        <button class="normal">${opt.changeLabel}</button>
                        <button class="remove" style="display: none;">${opt.removeLabel}</button>
                    </div>`;
                } else if (opt.type === "text" && opt.multiline) {
                    optionsHTML += `<label for="${opt.id}">${opt.label}</label> <textarea class="settings-textarea" id="${opt.id}"></textarea>`;
                } else if (opt.type === "slider") {
                    optionsHTML += `
                        <input type="range" 
                            value="${opt.defaultValue ? opt.defaultValue : "0"}"
                            min="${opt.min ? opt.min : "0"}"
                            max="${opt.max ? opt.max : "100"}"
                            id="${opt.id}"
                            class="inputSlider"
                        />`;
                } else if (opt.type === "radio") {
                    optionsHTML += `<div class="radiogroup">`
                    let isCheckedSet = false;
                    opt.buttons.forEach(btn => {
                        let isChecked = JSON.parse(localStorage.getItem(`${btn.id}-input`)) ?? (btn.default === "true" && !isCheckedSet);
                        if (isChecked) isCheckedSet = true;
                        optionsHTML += `
                            <div class="radio-btn" id="${btn.id}">
                                <input type="radio" name="${opt.id}" ${isChecked ? 'checked' : ''} id="${btn.id}-input">
                                <span class="radio-text">${btn.name}</span>
                                <span class="radio-circle"></span>
                            </div>`;
                        setTimeout(() => {
                            if (btn.onClick) { $(btn.id).addEventListener("click", (e) => {
                                const radio = e.target.closest("div.radio-btn").querySelector("input[type='radio']");
                                opt.buttons.forEach(btn => localStorage.setItem(`${btn.id}-input`, "false"));
                                radio.checked = true;
                                localStorage.setItem(radio.id, "true");
                                btn.onClick();
                            }); }
                        }, SETTINGS_TIMEOUT);
                    });
                    optionsHTML += `</div>`;
                } else if (opt.type === "btn") {
                    optionsHTML += `<button class="optionButton ${opt.buttonType}" id="${opt.id}">${opt.text}</button>`
                    setTimeout(() => { if (opt.onClick) $(opt.id).addEventListener("click", () => opt.onClick()); }, SETTINGS_TIMEOUT);
                } else if (opt.type === "color") {
                    const savedColor = localStorage.getItem(`${opt.id}-input`) ?? "#7289DA";
                    optionsHTML += `
                        <div class="color-picker" id="${opt.id}">
                              <svg id="color-icon" class="color-icon" viewBox="0 0 24 24" width="16" height="16">
                                <path fill="primary-530" d="m13.96 5.46 4.58 4.58a1 1 0 0 0 1.42 0l1.38-1.38a2 2 0 0 0 0-2.82l-3.18-3.18a2 2 0 0 0-2.82 0l-1.38 1.38a1 1 0 0 0 0 1.42ZM2.11 20.16l.73-4.22a3 3 0 0 1 .83-1.61l7.87-7.87a1 1 0 0 1 1.42 0l4.58 4.58a1 1 0 0 1 0 1.42l-7.87 7.87a3 3 0 0 1-1.6.83l-4.23.73a1.5 1.5 0 0 1-1.73-1.73Z"></path>
                            </svg>
                            <input type="color" id="${opt.id}-input" value="${savedColor}">
                        </div>`;
                    setTimeout(() => {
                        const input = $(`${opt.id}-input`);
                        input.addEventListener("input", e => {
                            const bright = "var(--white-500)", dark = "black", svg = input.parentElement.querySelector("path");
                            
                            function brightness(hex) {
                                const r = parseInt(hex.substr(1, 2), 16), g = parseInt(hex.substr(3, 2), 16), b = parseInt(hex.substr(5, 2), 16);
                                return (r * 299 + g * 587 + b * 114) / 1000;
                            }
                            svg.setAttribute("fill",brightness(e.target.value)<210?bright:dark)
                            
                            localStorage.setItem(`${opt.id}-input`, e.target.value);
                            if (opt.onColorSelect) opt.onColorSelect(e.target.value);
                        });
                        input.dispatchEvent(new Event("input", { bubbles: true }));
                        if (opt.onColorSelect) opt.onColorSelect(input.value);
                    }, SETTINGS_TIMEOUT);
                } else {
                    optionsHTML += `<label for="${opt.id}">${opt.label}</label> <input type="${opt.type}" id="${opt.id}" ${opt.accept ? `accept="${opt.accept}"` : ""}>`; 
                }
            });
            if (section.button) optionsHTML += `<button id="button-sect-${key}">${section.button.text}</button>`;
            contentHTML += `<div id="${key}-settings" class="settings-section hidden">${optionsHTML}</div>`;
        });
    });
    function updateDependentToggleState(toggle, parentEnabled) {
        const container = toggle.closest('.toggle-container');
        if (toggle.hasAttribute('data-force-disabled')) { return; }
        toggle.disabled = !parentEnabled;
        container.classList.toggle('disabled', !parentEnabled);
        if (!parentEnabled && toggle.checked) {
            toggle.checked = false;
            localStorage.setItem(toggle.id, false);
            Object.values(settingsData).flatMap(cat => Object.values(cat)).forEach(section => { const option = section.options.find(opt => opt.id === toggle.id); option?.onToggle?.(false); });
        }
    }
    const sidebar = $("settings-sidebar"), content = $("settings-content"), container = $("settings-container");

    sidebar.innerHTML = sidebarHTML; sidebar.classList.add("hide"); 
    content.innerHTML = contentHTML

    const socials = document.createElement("div");
    socials.classList.add("socialLinks");
    socials.innerHTML = `
    <a class="link" href="https://github.com/SparkleCord" rel="noreferrer noopener" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg></a>
    <a class="link" href="https://discord.com/invite/2KSv4cYaDC" rel="noreferrer noopener" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg></a>`;
    sidebar.appendChild(socials);

    const versionElement = document.createElement("p"); versionElement.id = "version-info"; versionElement.innerHTML = versionHTML;
    sidebar.appendChild(versionElement);
    versionElement.addEventListener("click", () => {
        navigator.clipboard.writeText(versionElement.textContent.trim());
        versionElement.style.color = "var(--status-positive)";
        setTimeout(() => { versionElement.style.color = "var(--text-muted)"; }, 200);
    });

    const menuButton = document.createElement("button"); menuButton.id = "sidebarToggle";
    menuButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--interactive-normal)"> <path d="M4 6.5a1.5 1.5 0 011.5-1.5h13a1.5 1.5 0 010 3h-13A1.5 1.5 0 014 6.5zM4 12a1.5 1.5 0 011.5-1.5h13a1.5 1.5 0 010 3h-13A1.5 1.5 0 014 12zM4 17.5a1.5 1.5 0 011.5-1.5h13a1.5 1.5 0 010 3h-13A1.5 1.5 0 014 17.5z"/></svg>`;
    container.prepend(menuButton);
    menuButton.addEventListener("click", () => {
        sidebar.classList.toggle("hide");
    });

    const tabs = document.querySelectorAll(".settings-tab"), sections = document.querySelectorAll(".settings-section");
    tabs[0].classList.add("active");
    sections[0].classList.remove("hidden");
    tabs.forEach(tab => tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active")); sections.forEach(s => s.classList.add("hidden")); tab.classList.add("active");
        $(tab.dataset.tab).classList.remove("hidden");
    }));
    document.addEventListener("keydown", e => {
        const tabs = [...document.querySelectorAll(".settings-tab")], active = document.activeElement;
        if (!tabs.includes(active)) return;
        const index = tabs.indexOf(active);
        if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault();
            const nextIndex = e.key === "ArrowDown" ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
                setTimeout(() => tabs[nextIndex].focus(), 0);
            }
    });
    document.querySelectorAll(".settings-section button").forEach(button => {
        let key = button.id.replace("button-sect-", "");
        Object.entries(settingsData).forEach(([_, sections]) => {if (sections[key]?.button?.onClick) { button.addEventListener("click", sections[key].button.onClick); }});
    });

    document.querySelectorAll(".switch input").forEach(toggle => {
        if (toggle.hasAttribute('data-force-disabled')) { return; }
        if (toggle.hasAttribute('data-depends-on')) {
            const parent = $(toggle.getAttribute('data-depends-on'));
            updateDependentToggleState(toggle, parent.checked);
            parent.addEventListener('change', (e) => { updateDependentToggleState(toggle, e.target.checked); });
        }
        toggle.addEventListener("change", (e) => {
            localStorage.setItem(e.target.id, e.target.checked);
            Object.values(settingsData).flatMap(cat => Object.values(cat)).forEach(section => { const option = section.options.find(opt => opt.id === e.target.id); option?.onToggle?.(e.target.checked); });
        });
    });

    document.querySelectorAll(".inputSlider").forEach(slider => {
        slider.addEventListener("input", function() {
            localStorage.setItem(this.id, this.value);
            const ratio = (this.value - this.min) / (this.max - this.min) * 100;
            this.style.background = `linear-gradient(90deg, var(--control-brand-foreground-new) ${ratio}%, var(--interactive-muted) ${ratio}%)`;
            Object.values(settingsData).flatMap(cat => Object.values(cat)).forEach(section => { 
                const option = section.options.find(opt => opt.id === this.id); option?.onInput?.(this.value); 
            });
        });
    });

    document.querySelectorAll(".radio").forEach(btn => {
        btn.addEventListener("click", (e) => {
            localStorage.setItem(e.target.id, e.target.checked);
            Object.values(settingsData).flatMap(cat => Object.values(cat)).forEach(section => { const option = section.options.find(opt => opt.id === e.target.id); option?.onToggle?.(e.target.checked); });
        });
    });

    document.addEventListener("keydown", (e) => { if (e.key === KEYBIND_CLOSE) { e.preventDefault(); closeSettingsPanel(); }});
    window.addEventListener('popstate', () => {
        const event = new KeyboardEvent('keydown', { key: KEYBIND_CLOSE });
        document.dispatchEvent(event);
    });
}

// Open / close
function openSettingsPanel() {
    $("settings-panel").style.display = "flex";

    $("global-name-input").value = profile.name;
    $("status-input").value = profile.status;
    $("username-input").value = profile.username;

    $("line-input").value = localStorage.getItem("custom-loading-line") || "";

    $("apikey-input").value = localStorage.getItem("hf_apikey") || "";
    $("model-input").value = localStorage.getItem("hf_model") || "HuggingFaceH4/zephyr-7b-beta";

    updateAvatarButtons();
}
function closeSettingsPanel() { $("settings-panel").style.display = "none"; }
function applySettings() {
    const sendBtnToggle = JSON.parse(localStorage.getItem("send-btn-toggle"));
    if (sendBtnToggle !== null) toggleSendButton(sendBtnToggle);

    function unescapeCommas(str) { if (typeof str === "string") { return str.split(',').map(item => item.replace(/\\,/g, ',')); } return str; }    
    userBlockedStrings = JSON.parse(localStorage.getItem("userBlockedStrings")) || []; 
    userBlockedMatches=(JSON.parse(localStorage.getItem("userBlockedMatches"))||[]).map(s=>{try{return s?new RegExp(s,"i"):null;}catch(e){return null}}).filter(Boolean);
    userExceptions = JSON.parse(localStorage.getItem("userExceptions")) || []; 
    if (userBlockedStrings.length > 0) { $("automod-text-input").value = unescapeCommas(userBlockedStrings).join(", "); }
    if (userBlockedMatches.length > 0) { $("automod-regex-input").value = unescapeCommas(userBlockedMatches.map(r => r.source)).join(", "); }
    if (userExceptions.length > 0) { $("automod-exceptions-input").value = unescapeCommas(userExceptions).join(", "); }
}
// Settings > Profile
function updateAvatarButtons() {
    const avatarInput = $("avatar-input");
    const avatarBtnsContainer = $("avatar-btns-container");
    avatarInput.replaceWith(avatarInput.cloneNode(true));
    avatarBtnsContainer.replaceWith(avatarBtnsContainer.cloneNode(true));
    const newAvatarInput = $("avatar-input");
    const newAvatarBtnsContainer = $("avatar-btns-container");
    newAvatarBtnsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("normal")) newAvatarInput.click();
        else if (e.target.classList.contains("remove")) {
            profile.avatar = profile.defaultAvatar;
            localStorage.setItem("profile", JSON.stringify({...profile, id: profile.id.toString() }));
            loadProfile(); updateAvatarButtons();
        }
    });
    newAvatarInput.addEventListener("change", () => {
        if (newAvatarInput.files.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
                profile.avatar = reader.result;
                localStorage.setItem("profile", JSON.stringify({...profile, id: profile.id.toString() }));
                loadProfile(); updateAvatarButtons();
            };
            reader.readAsDataURL(newAvatarInput.files[0]);
        }
    });
    newAvatarBtnsContainer.querySelector(".remove").style.display = profile.avatar !== profile.defaultAvatar ? "inline-block" : "none";
}
function loadProfile() {
    $("profile-picture").src = profile.avatar;
    $("global-name").textContent = profile.name;
    $("username").textContent = profile.status;
}
function saveProfile() {
    const name = $("global-name-input").value;
    const username = $("username-input").value;
    const status = $("status-input").value || "Online";
    const avatarInput = $("avatar-input");
    let avatar = profile.avatar;
    if (avatarInput.files.length > 0) {
        const reader = new FileReader();
        reader.onloadend = () => {
            profile = { ...profile, username, name, status, avatar: reader.result };
            localStorage.setItem("profile", JSON.stringify({...profile, id: profile.id.toString() }));
            loadProfile();
        };
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        profile = { ...profile, username, name, status, avatar };
        localStorage.setItem("profile", JSON.stringify({...profile, id: profile.id.toString() }));
        loadProfile();
    }
    closeSettingsPanel();
}
// Settings > Appearance
function toggleSendButton(isChecked) { $("send-btn").classList.toggle("hidden", !isChecked); }
// Srttings > Utility
function toggleEmoticonConversion(isChecked) {
    localStorage.setItem('auto-convert-emoticons', isChecked);
}
function convertEmoticons(text) {
    if (!JSON.parse(localStorage.getItem('auto-convert-emoticons'))) { return text; }
    const sortedEmoticons = Object.keys(emoticonJson).sort((a, b) => b.length - a.length);
    const pattern = new RegExp(sortedEmoticons.map(e =>  e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
    return text.replace(pattern, match => `:${emoticonJson[match]}:`);
}

function toggleAutoselectAutocomplete(isChecked) {
    localStorage.setItem('autoselect-in-autocomplete', isChecked);
}

// Settings > AutoMod
function saveAutomodSettings() {
    function escapeCommas(arr) { return arr.map(item => item.replace(/,/g, '\\,')); }
    userBlockedStrings = $("automod-text-input").value.split(/\r?\n|,/).map(s => s.trim()).filter(Boolean);
    userBlockedMatches = $("automod-regex-input").value.split(/\r?\n|,/).map(s => { 
        try { return s.trim() ? new RegExp(s.trim(), "i") : null; }  catch (e) { return null; } 
    }).filter(Boolean);
    userExceptions = $("automod-exceptions-input").value.split(/\r?\n|,/).map(s => s.trim()).filter(Boolean);
    localStorage.setItem("userBlockedStrings", JSON.stringify(escapeCommas(userBlockedStrings)));
    localStorage.setItem("userBlockedMatches", JSON.stringify(escapeCommas(userBlockedMatches.map(r => r.source))));
    localStorage.setItem("userExceptions", JSON.stringify(escapeCommas(userExceptions)));    
}
// Settings > Loading
function toggleLoadingLine(isChecked) {
    localStorage.setItem("custom-line-enabled", isChecked);
}
function saveLoadingSettings() {
    const line = $("line-input").value;
    localStorage.setItem("custom-loading-line", line);
}
// Settings > AI
function toggleSparkly(isChecked) {
    if (isChecked) {
        localStorage.setItem("sparkly-enabled", true);
        sendSystemMessage({ 
            content: `## Congratulations on enabling Sparkly AI!`,
            embeds: [
                {
                    title: "How To Get Started",
                    color: 0xFFF000,
                    fields: [
                        { name: "Step 1", value: "Send a message" },
                        { name: "Step 2", value: "See the response!" },
                    ],
                    footer: { text: `Sent by ${profile.name}`, icon: profile.avatar },
                    timestamp: new Date().toISOString()
                }
            ]
        })
    } else {
        localStorage.setItem("sparkly-enabled", false);
        sendSystemMessage({ content: `aw, looks like you disabled Sparkly AI, see you next time!` })
    }
}
function toggleSparklyMarkov(isChecked) {
    if (!isChecked) {
        localStorage.setItem("sparkly-huggingface-enabled", true);
    } else {
        localStorage.setItem("sparkly-huggingface-enabled", false);
    }
}
function saveAISettings() {
    const key = $("apikey-input").value;
    const model = $("model-input").value;
    localStorage.setItem("hf_apikey", key);
    localStorage.setItem("hf_model", model);
}
// Settings > Examples
function toggleSecretSetting(isChecked) { 
    console.log(`Wait... YOU CLICKED THE SECRET SETTING?!?!?! IT\'S NOW ${isChecked.toString().toUpperCase()}!`);
    localStorage.setItem("secret-setting", isChecked);
}
function sliderLog(value) {
    console.log("Slider Value: " + value)
}

// Theme Setter
const VALID_THEMES = [ "light", "dark", "darker", "midnight" ];
function setTheme(theme) {
    if (!VALID_THEMES.includes(theme) && theme !== "system") {
        return console.error("You must select a VALID theme from the following: \n" + VALID_THEMES);
    }
    if (theme === "system") {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        console.log(`Successfully set theme to your preferred system theme, which is ${theme}.`);
    }
    document.documentElement.className = `theme-${theme}`;
    localStorage.setItem("user-theme", theme.toString())
    console.log(`Successfully set theme to ${theme}!`);
    if (localStorage.getItem("refresh-enabled") === "true") {
        document.documentElement.className = `theme-${theme} visual-refresh`;
        localStorage.setItem("user-theme", theme.toString())
        console.log(`Successfully set theme (w/ visual refresh) to ${theme}!`);
    }
    if (localStorage.getItem("clientTheme-enabled") === "true") {
        document.documentElement.className = `theme-${theme} customColors`;
        localStorage.setItem("user-theme", theme.toString())
        console.log(`Successfully set theme (w/ClientTheme) to ${theme}!`);
    }
    if (localStorage.getItem("clientTheme-enabled") === "true" && localStorage.getItem("refresh-enabled") === "true") {
        document.documentElement.className = `theme-${theme} customColors visual-refresh`;
        localStorage.setItem("user-theme", theme.toString())
        console.log(`Successfully set theme (w/customColors & visual-refresh) to ${theme}!`);
    }
    setRefreshState(); setThemeState();
}

// UserCSS
let UserCSS = $('UserCSS');
if (!UserCSS) { UserCSS = document.createElement('style'); UserCSS.id = 'UserCSS'; document.head.appendChild(UserCSS);  }
if (localStorage.getItem("UserCSS_Enabled") === "true") UserCSS.textContent = localStorage.getItem("UserCSS_Backup") || '';
window.addEventListener('message', e => { 
    if (e.data?.type === 'cssUpdate' && localStorage.getItem("UserCSS_Enabled") === "true") { UserCSS.textContent = e.data.css; } 
});
function openEditor() { window.open("./css-editor.html", "_blank", "popup,width=800,height=600,resizable=yes"); }
function toggleUserCSS(isChecked) {
    localStorage.setItem("UserCSS_Enabled", isChecked);
    UserCSS.textContent = isChecked ? localStorage.getItem("UserCSS_Backup") || '' : '';
}

// Visual Refresh
function toggleRefresh(isChecked) { localStorage.setItem("refresh-enabled", isChecked); setRefreshState(); }
function setRefreshState() {
    document.documentElement.classList.toggle("visual-refresh", localStorage.getItem("refresh-enabled") === "true");
}

// Client Theme
function toggleClientTheme(isChecked) { localStorage.setItem("clientTheme-enabled", isChecked); setThemeState(); }
function setThemeState() {
    document.documentElement.classList.toggle("customColors", localStorage.getItem("clientTheme-enabled") === "true");
}
function changeClientTheme(color) {
    if (color) {
        color = color.replace('#', ''); if (color.length === 3) color = color.split('').map(c => c + c).join(''); let r = parseInt(color.slice(0, 2), 16) / 255, g = parseInt(color.slice(2, 4), 16) / 255, b = parseInt(color.slice(4, 6), 16) / 255, max = Math.max(r, g, b), min = Math.min(r, g, b), h, s, l = (max + min) / 2; if (max === min) h = s = 0; else { let d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break }h *= 60 } $('clientThemeVars').textContent = `:root{--theme-h:${h};--theme-s:${s * 100}%;--theme-l:${l * 100}%}`;
    } else {
        $('clientThemeVars').textContent = ``;
    }
}
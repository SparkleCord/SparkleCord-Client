// Loading and initializing the settings
const settingsData = {
    "User Settings": {
        profile: {
            name: "Profile",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 15H7a4 4 0 0 0-4 4v2"/><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><circle cx="10" cy="7" r="4"/></svg>`,
            options: [
                { label: "Global Name", type: "text", id: "global-name-input", placeholder: humans.self.username },
                { label: "Username", type: "text", id: "username-input" },
                { label: "Status Text", type: "text", id: "status-input", placeholder: "'Online', 'Eating', 'Coding', etc." },
                {
                    label: "Avatar", type: "file", id: "avatar-input", accept: "image/*",
                    changeLabel: "Change Avatar", removeLabel: "Remove Avatar", containerId: "avatar-btns-container"
                }
            ],
            sectionOnSave: saveProfile
        },
    },

    "__sep__": {},

    "App Settings": {
        appearance: {
            name: "Appearance",
            options: [
                { label: "Pick your Theme", type: "info-title" },
                {
                    type: "radio", id: "theme-picker",
                    buttons: [
                        { name: "Light", id: "theme-light", onClick: () => setTheme("light") },
                        { name: "Dark (Ash)", id: "theme-dark", onClick: () => setTheme("dark"), default: "true" },
                        { name: "Darker", id: "theme-darker", onClick: () => setTheme("darker") },
                        { name: "Midnight (Onyx)", id: "theme-midnight", onClick: () => setTheme("midnight") },
                        { name: "Sync With System", id: "theme-system", onClick: () => setTheme("system") },
                    ]
                },
                {
                    label: "Enable Visual Refresh Colors", type: "toggle", id: "refresh-colors-toggle", onToggle: toggleRefreshColors, defaultState: "off",
                    description: "Enables the colors from the Visual Refresh theme from Discord."
                },
                {
                    label: "Enable Visual Refresh UI", type: "toggle", id: "refresh-ui-toggle", onToggle: toggleRefreshUI, defaultState: "off",
                    description: "Enables the UI Styles (not colors) from the Visual Refresh theme from Discord."
                },
                { label: "Client theme", type: "info-title" },
                {
                    label: "Enable Client Theme", type: "toggle", id: "clientTheme-toggle", onToggle: toggleClientTheme, defaultState: "off",
                    description: "Enables the old client theme experiment from Discord."
                },
                { id: "theme-color", type: "color", onColorSelect: updateColorVars },
                {
                    type: "info-warning", style: "margin-top: -10px;", label: `This does <strong>not</strong> work on Midnight or Darker.
                    <br>Your UserCSS styles will still work.`,
                }
            ],
        },
        accessibility: {
            name: "Accessibility",
            options: [
                { label: "Saturation", type: "info-title" },
                {
                    type: "slider",
                    id: "accessibility-saturation",
                    onInput: changeSaturation, autosave: true, defaultValue: 100, min: 0, max: 100,
                },
                { label: "Reduce the saturation of colors within the application, for those with color sensitivities. This does not affect the saturation of images, videos, role colors or other user-provided content by default.", type: "info", style: "margin-top: -4px;" },
                {
                    label: "Apply To Custom Color Choices", type: "toggle", id: "custom-saturation-colors-toggle", onToggle: toggleSaturationCustom, defaultState: "off",
                    description: "Turn on to apply this adjustment to custom color choices, like role colors"
                },
                {
                    label: "Always Underline Links", type: "toggle", id: "always-underline-links", onToggle: toggleLinkUnderlining, defaultState: "off",
                    description: "Make links to websites, help articles, and other pages stand out more by underlining them."
                },
                { label: "Contrast", type: "info-title" },
                {
                    label: "Enable High Contrast Mode", type: "toggle", id: "hi-contrast-toggle", onToggle: toggleContrastMode, defaultState: "off",
                    description: "Enhance visibility with bold colors and sharp contrast."
                },
            ]
        },
        chat: {
            name: "Chat",
            options: [
                {
                    type: "info-warning", style: "margin-top: -10px;", label: `<em>Don't see any options? The following options may be hidden:</em>
                    <br> - Show Send Message Button (It <strong>has</strong> to be visible to be able to send messages on mobile.)`,
                },
                { label: "Show Send Message Button", type: "toggle", id: "send-btn-toggle", onToggle: toggleSendButton, defaultState: "on", hideIf: "CONDITION_Mobile" },
                {
                    label: "Show 'Today At' in Timestamps", type: "toggle", id: "today-toggle", onToggle: toggleTodayAt, defaultState: "on",
                    description: "Turn this off if you want more concise timestamps."
                },
                {
                    label: "Show Title Bar", type: "toggle", id: "title-toggle", onToggle: toggleHeader, defaultState: "off",
                    description: "Show the title bar/header on top of the screen."
                }
            ]
        },
        utility: {
            name: "Utility",
            options: [
                {
                    label: "Automatically convert emoticons in your messages to emoji", type: "toggle", id: "auto-convert-emoticons", onToggle: toggleEmoticonConversion,
                    defaultState: "off",
                    description: "For example, when you type :) SparkleCord will convert it to :slight_smile:",
                },
                {
                    label: "Automatically select the first autocomplete option", type: "toggle", id: "autocomplete-autoselect", onToggle: toggleAutoselectAutocomplete,
                    defaultState: "on",
                    description: "This also allows you to navigate autocomplete much easier!",
                },
            ]
        },
        automod: {
            name: "AutoMod",
            options: [
                { label: "Choose Your Words", type: "text", id: "automod-text-input", multiline: true },
                { label: "Separate words or phrases with a comma (dog, cat, tiger) or new line. Use * at the beginning, end, or both for partial matching.", type: "info", style: "margin-top: -10px;" },

                { label: "Blocked Regex Patterns", type: "text", id: "automod-regex-input", multiline: true },
                { label: "Regex patterns must follow proper syntax. Invalid patterns may be ignored.", type: "info", style: "margin-top: -10px;" },

                { label: "Exceptions", type: "text", id: "automod-exceptions-input", multiline: true },
                { label: "Words or phrases here will not be blocked, even if they match blocked content or regex.", type: "info", style: "margin-top: -10px;" },
                { label: "You cannot use this to override the *System* AutoMod, only the *User* one.", type: "info", style: "margin-top: -20px;" },
            ],
            sectionOnSave: saveAutomodSettings
        },

        // if (EASTER_EGGS_ENABLED_DEVELOPMENT)
        // party: {
        //     name: "Birthday Mode",
        //     icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M5.8 11.3 2 22l10.7-3.79M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10m8 3-.82-.33c-.86-.34-1.82.2-1.98 1.11-.11.7-.72 1.22-1.43 1.22H17M11 2l.33.82c.34.86-.2 1.82-1.11 1.98-.7.1-1.22.72-1.22 1.43V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg>`,

        //     options: [
        //         { text: "All Achievements", type: "label" },
        //         { type: "custom", html: `<div id="settings-achievements-grid"></div>` }
        //     ]
        // }
    },

    "__sep__ 2": {},

    "Custom Settings": {
        loading: {
            name: "Loading",
            options: [
                { label: "Loading Line", type: "text", id: "line-input" },
                { label: "Use Custom Loading Line", type: "toggle", id: "custom-line", onToggle: toggleLoadingLine, defaultState: "off", description: `Uses the custom loading line you set above instead of SparkleCord default, for Example: "The app is loading :o". ` },
            ],
            sectionOnSave: saveLoadingSettings
        },
        css: {
            name: "UserCSS",
            options: [
                { text: "Open Editor", id: "open-ucss-editor", type: "btn", onClick: openEditor, buttonType: "brand", filled: true },
                {
                    label: "Use UserCSS", type: "toggle", id: "usercss-toggle", onToggle: toggleUserCSS, defaultState: "off",
                    description: `Use the CSS styles from the editor.`
                },
                {
                    label: "Use Monaco as Default Code Editor", type: "toggle", id: "usercss-monaco-toggle", onToggle: toggleEditorMode, defaultState: "on",
                    description: `If disabled, uses ACE Editor instead, which works without an internet connection.`
                },
            ],
        },
        // custom_role: {
        //     name: "Custom Role",
        //     options: [
        //         { text: "This section is primarily for customizing your SparkleCord role, including the color, name, and more!", type: "label" },
        //         {
        //             label: "Show Role Color", type: "toggle", id: "role-color-toggle", onToggle: toggleUserRoleColor, defaultState: "off",
        //             description: `Show your custom role color (such as gradients), if disabled, uses default color.`
        //         },
        //         { label: "Non-gradient Role Color", type: "info-title", style: "margin-top: -30px;" },
        //         { label: "This is the single color that will appear on your name.", type: "info", style: "margin-top: -15px;" },
        //       //  { type: "nameAndDesc", name: "Non-Gradient Role Color", description: "This is the single color that will appear on your name." },
        //         { id: "role-color", type: "color", onColorSelect: updateRoleColor },
        //     ]
        // },
        plugin_management: {
            name: "Plugins",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"><path d="M7.5 4.5C7.5 3.11929 8.61929 2 10 2C11.3807 2 12.5 3.11929 12.5 4.5V6H13.5C14.8978 6 15.5967 6 16.1481 6.22836C16.8831 6.53284 17.4672 7.11687 17.7716 7.85195C18 8.40326 18 9.10218 18 10.5H19.5C20.8807 10.5 22 11.6193 22 13C22 14.3807 20.8807 15.5 19.5 15.5H18V17.2C18 18.8802 18 19.7202 17.673 20.362C17.3854 20.9265 16.9265 21.3854 16.362 21.673C15.7202 22 14.8802 22 13.2 22H12.5V20.25C12.5 19.0074 11.4926 18 10.25 18C9.00736 18 8 19.0074 8 20.25V22H6.8C5.11984 22 4.27976 22 3.63803 21.673C3.07354 21.3854 2.6146 20.9265 2.32698 20.362C2 19.7202 2 18.8802 2 17.2V15.5H3.5C4.88071 15.5 6 14.3807 6 13C6 11.6193 4.88071 10.5 3.5 10.5H2C2 9.10218 2 8.40326 2.22836 7.85195C2.53284 7.11687 3.11687 6.53284 3.85195 6.22836C4.40326 6 5.10218 6 6.5 6H7.5V4.5Z" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
            options: [
                { type: "custom", html: `<div class="vc-plugins-grid"></div>` },
            ]
        }
    },

    "__sep__ 5": {},

    "Developer Only": {
        demos: {
            name: "Demos",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3"/><path d="m16 2 6 6"/><path d="M12 16H4"/></svg>`,
            options: [
                { label: "Custom Options", type: "info-title" },
                { type: "separator" },
                {
                    type: "custom",
                    id: "custom-option",
                    html: `<button class="button brand">This is a button using custom HTML</button>`
                },
                { label: "Custom options may have <em>any</em> (valid) HTML you may think of.", type: "info" },
                { label: "Toggle Options", type: "info-title" },
                { type: "separator" },
                {
                    label: "Depends (PARENT)",
                    type: "toggle",
                    id: "example-depends-parent",
                    defaultState: "off",
                    description: "If this toggle is on, all options that depend on it will be enabled.", autosave: true,
                },
                {
                    label: "Depends (CHILD)",
                    type: "toggle",
                    id: "example-depends-child",
                    defaultState: "off",
                    description: "I depend on the option above me!",
                    dependsOn: "example-depends-parent", autosave: true,
                },
                {
                    label: "Disabled (Wihthout Depends)",
                    type: "toggle",
                    id: "disabled-option",
                    defaultState: "off",
                    description: "Yes...",
                    disabled: true, autosave: true,
                },
                {
                    label: "Toggle Option",
                    type: "toggle",
                    id: "toggle-option",
                    defaultState: "off",
                    description: "Description for the toggle option.", autosave: true,
                },
                { label: "Slider", type: "info-title" },
                { type: "separator" },
                {
                    type: "slider",
                    id: "slider-example",
                },
                { label: "Radio", type: "info-title" },
                { type: "separator" },
                {
                    type: "radio",
                    id: "radio-buttons-example",
                    buttons: [
                        { name: "Auto", id: "ex-r-auto", default: "true" },
                        { name: "720p", id: "ex-r-720p" },
                        { name: "1080p", id: "ex-r-1080p" },
                    ]
                },
                { label: "Buttons", type: "info-title" },
                { type: "separator" },
                { text: "Brand - Filled", id: "brand-filled", type: "btn", buttonType: "brand", filled: true },
                { text: "Brand - Outline", id: "brand-outline", type: "btn", buttonType: "brand", filled: false },
                { text: "Brand - Inverted", id: "brand-inverted", type: "btn", buttonType: "brand", inverted: true },
                { text: "Positive - Filled", id: "positive-filled", type: "btn", buttonType: "positive", filled: true },
                { text: "Positive - Outline", id: "positive-outline", type: "btn", buttonType: "positive", filled: false },
                { text: "Positive - Inverted", id: "positive-inverted", type: "btn", buttonType: "positive", inverted: true },
                { text: "Danger - Filled", id: "danger-filled", type: "btn", buttonType: "danger", filled: true },
                { text: "Danger - Outline", id: "danger-outline", type: "btn", buttonType: "danger", filled: false },
                { text: "Danger - Inverted", id: "danger-inverted", type: "btn", buttonType: "danger", inverted: true },
                { text: "Secondary - Filled", id: "secondary-filled", type: "btn", buttonType: "secondary", filled: true },
                { text: "Secondary - Outline", id: "secondary-outline", type: "btn", buttonType: "secondary", filled: false },
                { text: "Secondary - Inverted", id: "secondary-inverted", type: "btn", buttonType: "secondary", inverted: true },
                { text: "Warning - Filled", id: "warning-filled", type: "btn", buttonType: "warning", filled: true },
                { text: "Warning - Outline", id: "warning-outline", type: "btn", buttonType: "warning", filled: false },
                { text: "Warning - Inverted", id: "warning-inverted", type: "btn", buttonType: "warning", inverted: true },
                { text: "Alert - Filled", id: "alert-filled", type: "btn", buttonType: "alert", filled: true },
                { text: "Alert - Outline", id: "alert-outline", type: "btn", buttonType: "alert", filled: false },
                { text: "Alert - Inverted", id: "alert-inverted", type: "btn", buttonType: "alert", inverted: true },
                { text: "Info - Filled", id: "info-filled", type: "btn", buttonType: "info", filled: true },
                { text: "Info - Outline", id: "info-outline", type: "btn", buttonType: "info", filled: false },
                { text: "Info - Inverted", id: "info-inverted", type: "btn", buttonType: "info", inverted: true },
                { text: "Lurking - Filled", id: "lurking-filled", type: "btn", buttonType: "lurking", filled: true },
                { text: "Lurking - Outline", id: "lurking-outline", type: "btn", buttonType: "lurking", filled: false },
                { text: "Lurking - Inverted", id: "lurking-inverted", type: "btn", buttonType: "lurking", inverted: true },
                { text: "Nitro", id: "nitro-filled", type: "btn", buttonType: "nitro", filled: true },
                { text: "Nitro Tier 2", id: "nitro2-filled", type: "btn", buttonType: "nitro2", filled: true },
                { text: "Nitro Tier 3", id: "nitro3-filled", type: "btn", buttonType: "nitro3", filled: true },
                { label: "Other Stuff", type: "info-title" },
                { type: "separator" },
                { label: "info-title", type: "info-title" },
                { label: "info-warning", type: "info-warning", style: "margin-top: -4px;" },
                { label: "info", type: "info", style: "margin-top: -25px;" },
                { id: "example-color-input", type: "color" },
                { label: "File Inputs", type: "info-title" },
                { type: "separator" },
                {
                    label: "File Label", type: "file", id: "file-input-ex", accept: "image/*",
                    changeLabel: "Add Banner", removeLabel: "Remove Banner", containerId: "example-file-btns-container"
                },
                { label: "<strong>IMPORTANT WARNING ⚠</strong>: These types of inputs will NOT do anything without a special function specifically for them. This may change in the future.", type: "info-warning", style: "margin-top: -4px;" },
                { type: "separator" },
                { label: "Text Inputs", type: "info-title" },
                { type: "separator" },
                { type: "text", id: "multiline-text-input-example", multiline: true, placeholder: "Multiline Text Area", autosave: true, },
                { type: "text", id: "text-input-example", placeholder: "Single Line Text Area", autosave: true, },
            ]
        },
    },

    "__sep__ 4": {
        credits: {
            name: "Credits",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
            options: [
                { label: "Contributors", type: "info-title" },
                { text: "Thanks to everyone here for contributing to this project in one way or another, your support goes a long way <3", type: "label" },
                { type: "nameAndDesc", name: "gdtapioka", description: "- Suggested 2 Custom Loading Lines" },
                { type: "nameAndDesc", name: "system33__", description: `
                    - Suggested Socials Above Version Info
                    <br>
                    - Pointed out issues and bugs
                ` },
                { type: "nameAndDesc", name: "bigberry_31", description: "- Came up with the initial concept for the SparkleCord logo" },
                { type: "nameAndDesc", name: "the_upgrater", description: `
                    - Suggested ClientTheme (Inspired by Vencord's ClientTheme plugin.)
                    <br>
                    - Pointed out issues and bugs
                    <br>
                ` },
                { type: "info", label: "If you feel you've contributed but aren't listed here, I've probably just forgotten you, contact me on Discord (username is 'doctoon') with your contributions and I'll list you here." },

                { label: "Acknowledgements", type: "info-title" },
                { text: "While the people, platforms, or projects listed here haven't directly contributed, they've helped shape up SparkleCord to be how it is today.", type: "label" },

                { type: "nameAndDesc", name: "Vencord", description: `
                    I've used some of Vencord's code in 1.2.0 and 1.3.0, so I feel it's best to credit them, as I don't want to seem like I'm stealing.<br>
                    - ClientTheme (not directly taken, but i've taken some of the CSS and basic logic to make it work on SparkleCord)
                    <br>
                    - Some parts of the plugin HTML/CSS were taken but adapted quite a bit to fit SparkleCord's layout.
                ` },

                { type: "nameAndDesc", name: "Twemoji (JDecked)", description: `- 99% of the emojis are from the Twemoji fork currently maintained by jdecked (https://github.com/jdecked/twemoji)` },
                { type: "nameAndDesc", name: "Monaco (Microsoft)", description: `- UserCSS Editor` },
                { type: "nameAndDesc", name: "Lucide Icons", description: `- The icons you see in Settings` },

                { label: "Emojis", type: "info-title" },
                { text: "Emojis made by other humans that I found on the internet.", type: "label" },
                { type: "nameAndDesc", name: "cosmoflare", description: `- axolotl emoji (https://x.com/cosmoflare/status/1103086243452256256)` },
                { type: "nameAndDesc", name: "nido-emojis (tumblr)", description: `- dandelion emoji (https://tumblr.com/nido-emojis/648262778096893952/discord-flowers)` },
                { type: "nameAndDesc", name: "clar (emoji.gg)", description: `- chocolate box emoji (https://emoji.gg/user/clar1nettist)` },
                
            ],
        }
    },

    "__sep__ 6": {},
};

// Custom Conditions
window.CONDITION_Mobile = window.innerWidth < 768;
window.addEventListener("resize", () => {
    window.CONDITION_Mobile = window.innerWidth < 768;
});
setInterval(() => {
    document.querySelectorAll("[data-hidecondition]").forEach(el => {
        const condition = window[el.dataset.hidecondition];
        // debugLog(`[${el.dataset.hidecondition}] = ${condition}`);
        el.style.display = condition ? "none" : "";
    });
}, 100);
// Custom Conditions - End

let hasUnsavedChanges = false;
let originalSettings = {};
const currentSettings = {};
trackChanges();

/* Settings Handling */

function createSettingsPanel() {
    const settingsPanel = el("div", { id: "settings-panel", className: "hidden", style: { display: "flex" } });

    settingsPanel.innerHTML = `
        <div id="settings-container">

            <div class="layerContainer_da8173" style="display: none;">
                <div class="backdrop__78332 withLayer__78332" style="background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(0px);"></div>
                    <div class="layer_bc663c">
                        <div class="focusLock__49fc1" role="dialog" aria-labelledby=":r2tl:" tabindex="-1" aria-modal="true">
                            <div class="vc-text-selectable root__49fc1 medium__49fc1 fullscreenOnMobile__49fc1 rootWithShadow__49fc1" style="opacity: 1; transform: scale(1);">
                                <div class="flex__7c0ba horizontal__7c0ba justifyStart_abf706 alignCenter_abf706 noWrap_abf706 header__49fc1" id=":r2tl:" style="flex: 0 0 auto;">
                                    <div class="defaultColor__4bd52 heading-lg/semibold_cf4812" data-text-variant="heading-lg/semibold" style="flex-grow: 1;">SparkleHook</div>
                                    <button aria-label="Close" type="button" class="close__49fc1 button__201d5 lookBlank__201d5 colorBrand__201d5 grow__201d5">
                                    <div class="contents__201d5">
                                        <svg class="closeIcon__49fc1" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z"></path>
                                        </svg>
                                    </div>
                                </button>
                            </div>
                            <div class="content__49fc1 thin_d125d2 scrollerBase_d125d2" dir="ltr" style="overflow: hidden scroll; padding-right: 16px;">
                                <div>
                                    <div class="vc-plugin-modal-info" style="display: flex; gap: 1em;">
                                        <div>Send messages to Discord using a webhook.</div>
                                    </div>
                                </div>
                                <div style="margin-bottom: 16px;">
                                    <div style="gap: 12px; margin-top: 16px; display: flex; flex-direction: column;">
                                        <div id="modal-settings-container">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex__7c0ba horizontalReverse__7c0ba justifyStart_abf706 alignStretch_abf706 noWrap_abf706 footer__49fc1 footerSeparator__49fc1" style="flex: 0 0 auto;">
                                <div style="width: 100%; display: flex; gap: 1em; flex-direction: column;">
                                    <div style="margin-left: auto; display: flex; gap: 1em;">
                                        <button class="remove">Cancel</button>
                                        <button type="button" class="button brand filled">Save & Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
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
    $("#settings-panel-container").appendChild(settingsPanel);
    settingsPanel.querySelectorAll("[id^='close-settings-btn']").forEach(btn => btn.addEventListener("click", closeSettingsPanel));

    let sidebarHTML = ``, contentHTML = "";

    Object.entries(settingsData).forEach(([category, sections]) => {
        if (category.startsWith("__sep__")) { sidebarHTML += `<div class="separator"></div>`; } else { sidebarHTML += `<div class="eyebrow">${category}</div>`; }
        Object.entries(sections).forEach(([key, section], index) => {
            sidebarHTML += `<button class="settings-tab" data-tab="${key}-settings">${section.name} ${section.icon ? section.icon : ``}</button>`;
            let optionsHTML = `<h2>${section.name}</h2>`;
            section.options.forEach(opt => {
                // Generate HTML
                if (SettingsManager.types[opt.type]) {
                    optionsHTML += SettingsManager.types[opt.type](opt);
                }
                
                // Bind events if needed
                if (SettingsManager.binders[opt.type]) {
                    SettingsManager.binders[opt.type](opt);
                }
            });
            contentHTML += `<div id="${key}-settings" class="settings-section hidden">${optionsHTML}</div>`;
        });
    });

    function updateDependentToggleState(toggle, parentEnabled) {
        const container = toggle.closest(".toggle-container");
        if (toggle.hasAttribute("data-force-disabled")) { return; }
        toggle.disabled = !parentEnabled;
        container.classList.toggle("disabled", !parentEnabled);
        if (!parentEnabled && toggle.checked) {
            toggle.checked = false;
            localStorage.setItem(toggle.id, false);
            Object.values(settingsData).flatMap(cat => Object.values(cat)).forEach(section => { const option = section.options.find(opt => opt.id === toggle.id); option?.onToggle?.(false); });
        }
    }
    const sidebar = $("#settings-sidebar"), content = $("#settings-content"), container = $("#settings-container");

    sidebar.innerHTML = sidebarHTML; sidebar.classList.add("hide");
    content.innerHTML = contentHTML + `<div class="unsavedContainer" style="display: none;"><div class="unsavedContainerRow"><div class="textContainer"><div class="text">Careful — you have unsaved changes!</div></div><div class="actions"><button type="button" class="reset">Reset</button><button type="button" class="save">Save Changes</button></div></div></div>`;

    const socials = document.createElement("div");
    socials.classList.add("socialLinks");
    socials.innerHTML = `<a class="link" href="https://github.com/SparkleCord" rel="noreferrer noopener" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg></a>
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
    let currentTab = tabs[0];

    tabs[0].classList.add("active");
    sections[0].classList.remove("hidden");

    tabs.forEach(tab => tab.addEventListener("click", () => {
        if (hasUnsavedChanges) { flashRed(); return; }

        const previousTab = currentTab;
        currentTab = tab;

        tabs.forEach(t => t.classList.remove("active"));
        sections.forEach(s => s.classList.add("hidden"));
        tab.classList.add("active");
        $(`[id='${tab.dataset.tab}']`).classList.remove("hidden");

        eventBus.emit("settingsTabSwitch", { timestamp: Date.now(), from: previousTab.dataset.tab, to: tab.dataset.tab });
    }));

    document.addEventListener("keydown", e => {
        const tabs = [...document.querySelectorAll(".settings-tab")], active = document.activeElement;
        if (!tabs.includes(active)) return;
        const index = tabs.indexOf(active);
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            const nextIndex = e.key === "ArrowDown" ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
            setTimeout(() => tabs[nextIndex].focus(), 0);
        }
    });

    // Toggle switches
    document.querySelectorAll(".switch input").forEach(toggle => {
        if (toggle.hasAttribute("data-force-disabled")) return;
        if (toggle.hasAttribute("data-depends-on")) {
            const parent = $(`#${toggle.getAttribute('data-depends-on')}`);
            updateDependentToggleState(toggle, parent.checked);
            parent.addEventListener("change", (e) => updateDependentToggleState(toggle, e.target.checked));
        }
        toggle.addEventListener("change", (e) => {
            const option = findOptionById(e.target.id);
            const isChecked = e.target.checked;
            
            if (option?.autosave !== false) {
                localStorage.setItem(option.id, isChecked);
                option.onToggle?.(isChecked);
            } else {
                currentSettings[option.id] = isChecked;
                checkForChanges();
            }
            emitSettingsChange(option, findOptionSection(option.id), isChecked);
        });
    });

    // Range sliders
    document.querySelectorAll(".rangeSlider").forEach(slider => {
        const opt = findOptionById(slider.id);
        slider.value = Number(localStorage.getItem(opt.id));
        let val = Number(slider.value);
        opt.onInput?.(val);
        let ratio = (val - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = `linear-gradient(90deg, var(--control-brand-foreground-new) ${ratio}%, var(--interactive-muted) ${ratio}%)`;

        slider.addEventListener("input", function() {
            val = Number(slider.value);
            ratio = (val - slider.min) / (slider.max - slider.min) * 100;
            slider.style.background = `linear-gradient(90deg, var(--control-brand-foreground-new) ${ratio}%, var(--interactive-muted) ${ratio}%)`;

            if (opt.autosave === true) {
                opt.onInput?.(val);
                localStorage.setItem(opt.id, val);
            } else {
                currentSettings[opt.id] = val;
                checkForChanges();
            }
            emitSettingsChange(opt, findOptionSection(opt.id), val);
        });
    });

    // Text inputs
    document.querySelectorAll("#settings-panel input[type='text']").forEach(input => {
        const opt = findOptionById(input.id);
        input.value = localStorage.getItem(opt.id);
        input.addEventListener("input", function() {
            const opt = findOptionById(this.id);
            const val = this.value;
            if (opt.autosave === true) {
                opt.onInput?.(val);
                localStorage.setItem(opt.id, val);
            } else {
                currentSettings[opt.id] = val;
                checkForChanges();
            }
            emitSettingsChange(opt, findOptionSection(opt.id), val);
        });
    });
    // Textareas
    document.querySelectorAll(".settings-textarea").forEach(input => {
        const opt = findOptionById(input.id);
        input.value = localStorage.getItem(opt.id);
        input.parentElement.querySelector(".charcount").textContent = `${input.value.length}`;
        input.addEventListener("input", function() {
            input.parentElement.querySelector(".charcount").textContent = `${input.value.length}`;
            const opt = findOptionById(this.id);
            const val = this.value;
            if (opt.autosave === true) {
                opt.onInput?.(val);
                localStorage.setItem(opt.id, val);
            } else {
                currentSettings[opt.id] = val;
                checkForChanges();
            }
            emitSettingsChange(opt, findOptionSection(opt.id), val);
        });
    });

    // Radio buttons
    document.querySelectorAll(".radio-btn").forEach(radioBtn => {
        radioBtn.addEventListener("click", (e) => {
            const radioInput = radioBtn.querySelector("input[type='radio']");
            if (!radioInput) return;
            const option = findOptionById(radioInput.name);
            const section = findOptionSection(radioInput.name);
            const value = radioInput.value;
            if (option.autosave !== false) {
                option.buttons.forEach(btn => localStorage.setItem(`${btn.id}-input`, "false"));
                localStorage.setItem(`${radioInput.id}-input`, "true");
                option.onToggle?.(value);
            } else {
                currentSettings[option.id] = value;
                checkForChanges();
            }
            emitSettingsChange(option, section, value);
        });
    });

    // Unsaved changes
    document.querySelector(".unsavedContainer .save").addEventListener("click", () => {
        Object.values(settingsData).flatMap(cat => Object.values(cat)).forEach(section => {
            section.options.forEach(opt => {
                if (opt.autosave === true || opt.type === "file") return;
                const newValue = currentSettings[opt.id];
                if (newValue === undefined) return;
                switch (opt.type) {
                    case "toggle":
                        localStorage.setItem(opt.id, newValue);
                        opt.onToggle?.(newValue);
                        break;
                    case "radio":
                        const btn = opt.buttons.find(b => b.value === newValue);
                        if (btn) localStorage.setItem(`${btn.id}-input`, "true");
                        opt.onChange?.(newValue);
                        break;
                    case "color":
                        localStorage.setItem(`${opt.id}-input`, newValue);
                        opt.onColorSelect?.(newValue);
                        break;
                    case "slider":
                    case "text":
                    case "textarea":
                        localStorage.setItem(opt.id, newValue);
                        opt.onInput?.(newValue);
                        break;
                }
                originalSettings[opt.id] = {
                    original: newValue,
                    current: newValue
                };
                emitSettingsChange(opt, section, newValue);
            });
            section.sectionOnSave?.();
        });

        hasUnsavedChanges = false;
        const box = document.querySelector(".unsavedContainer");
        box.classList.remove("showing");
        box.classList.remove("flash");
        box.classList.add("hiding");
        setTimeout(() => box.style.display = "none", 200);
    });

    document.querySelector(".unsavedContainer .reset").addEventListener("click", () => {
        Object.values(settingsData).flatMap(cat => Object.values(cat)).forEach(section => {
            section.options.forEach(opt => {
                if (opt.type === "file" || (opt.autosave === true && !["text", "textarea", "slider"].includes(opt.type))) {
                    return;
                }
                let originalValue;
                if (originalSettings[opt.id]) {
                    originalValue = originalSettings[opt.id].original;
                }
                const input = $(`[id='${opt.id}']`);
                if (input && originalValue) {
                    switch (opt.type) {
                        case "toggle":
                            input.checked = originalValue;
                            break;
                        case "radio":
                            if (originalValue) {
                                const btnId = opt.buttons.find(b => b.value === originalValue)?.id;
                                if (btnId) {
                                    $(`${btnId}-input`).checked = true;
                                }
                            }
                            break;
                        case "color":
                            input.value = originalValue;
                            const svg = input.parentElement.querySelector("path");
                            const bright = "var(--white-500)", dark = "black";
                            svg.setAttribute("fill", brightness(originalValue) < 210 ? bright : dark);
                            break;
                        case "slider":
                            input.value = originalValue;
                            const ratio = (originalValue - input.min) / (input.max - input.min) * 100;
                            input.style.background = `linear-gradient(90deg, var(--control-brand-foreground-new) ${ratio}%, var(--interactive-muted) ${ratio}%)`;
                            break;
                        case "text":
                        case "textarea":
                            input.value = originalValue;
                            break;
                    }

                    switch (opt.type) {
                        case "toggle":
                            opt.onToggle?.(originalValue);
                            break;
                        case "radio":
                            opt.onToggle?.(originalValue);
                            break;
                        case "color":
                            opt.onColorSelect?.(originalValue);
                            break;
                        case "slider":
                        case "text":
                        case "textarea":
                            opt.onInput?.(originalValue);
                            break;
                    }
                }
                delete currentSettings[opt.id];
                eventBus.emit("settingsReset", {
                    option: opt,
                    optionSection: section,
                    defaultValue: originalValue,
                    timestamp: Date.now()
                });
            });
        });
        hasUnsavedChanges = false;
        const box = document.querySelector(".unsavedContainer");
        box.classList.remove("showing");
        box.classList.remove("flash");
        box.classList.add("hiding");
        setTimeout(() => box.style.display = "none", 200);
    });

    // listen for closing settings panel
    document.addEventListener("keydown", (e) => {
        if (e.key === KEYBIND_CLOSE && document.querySelector(".layerContainer_da8173").style.display === "none") {
            e.preventDefault(); closeSettingsPanel(); 
        }
    });
    window.addEventListener("popstate", () => {
        const event = new KeyboardEvent("keydown", { key: KEYBIND_CLOSE });
        document.dispatchEvent(event);
    });

    eventBus.emit("settingsLoaded", { timestamp: Date.now() });
}
trackChanges();

// Helpers
function findOptionById(id) {
    for (const category of Object.values(settingsData)) {
        for (const section of Object.values(category)) {
            const option = section.options.find(opt => opt.id === id);
            if (option) return option;
        }
    }
    return null;
}
function findOptionSection(optionId) {
    for (const [category, sections] of Object.entries(settingsData)) {
        for (const [key, section] of Object.entries(sections)) {
            if (section.options.some(opt => opt.id === optionId)) {
                return section;
            }
        }
    }
    return null;
}

function trackChanges() {
    originalSettings = {};
    Object.values(settingsData).flatMap(cat => Object.values(cat)).forEach(section => {
        section.options.forEach(opt => {
            const shouldTrack = (
                (["text", "textarea", "slider"].includes(opt.type) && opt.autosave !== true) ||
                (opt.autosave === false)
            ) && opt.type !== "file";
            if (!shouldTrack) return;
            let currentValue;
            switch (opt.type) {
                case "slider": currentValue = Number(localStorage.getItem(opt.id)) || Number(opt.min) || 0; break;
                case "text":
                case "textarea": currentValue = localStorage.getItem(opt.id) || ""; break;
                default: currentValue = localStorage.getItem(opt.id) ?? (opt.type === "toggle" ? false : null);
            }
            originalSettings[opt.id] = { 
                current: currentValue, 
                original: currentValue 
            };
        });
    });
}

function checkForChanges() {
    const box = document.querySelector(".unsavedContainer");
    let changed = false;
    Object.values(settingsData).flatMap(cat => Object.values(cat)).forEach(section => {
        section.options.forEach(opt => {
            if (!["text", "textarea", "slider"].includes(opt.type)) return;
            if (!originalSettings[opt.id]) return;

            let current = currentSettings.hasOwnProperty(opt.id) ? currentSettings[opt.id] :
                (opt.type === "slider" ? Number(localStorage.getItem(opt.id)) : localStorage.getItem(opt.id) || "");
            if (current !== originalSettings[opt.id].original) changed = true;
        });
    });
    hasUnsavedChanges = changed;
    if (changed) {
        if (!box.classList.contains("showing")) {
            box.classList.remove("hiding");
            box.classList.add("showing");
            box.style.display = "flex";
        }
    } else if (box.classList.contains("showing")) {
        box.classList.remove("showing");
        box.classList.add("hiding");
        setTimeout(() => box.style.display = "none", 200);
    }
    return changed;
}

function emitSettingsChange(option, section, newValue) {
    const oldValue = originalSettings[option.id]?.original;
    eventBus.emit("settingsChanged", {
        before: oldValue,
        after: newValue,
        option: option,
        optionSection: section,
        timestamp: Date.now()
    });
}

// Open / close
function openSettingsPanel() {
    $("#settings-panel").style.display = "flex";

    $("#global-name-input").value = humans.self.name;
    $("#username-input").value = humans.self.username;
    $("#status-input").value = humans.self.status;

    updateAvatarButtons();

    if (EASTER_EGGS_ENABLED_DEVELOPMENT) {
        document.querySelector(`.settings-tab[data-tab="party-settings"]`).style.display = (localStorage.getItem("sparkleCake") === "true" ? "flex" : "none");
    }

    eventBus.emit("settingsOpened", { timestamp: Date.now() });
}
function closeSettingsPanel() {
    if (hasUnsavedChanges) { flashRed(); return; }
    $("#settings-panel").style.display = "none";

    eventBus.emit("settingsClosed", { timestamp: Date.now() });
}
function flashRed() {
    const box = document.querySelector(".unsavedContainer");
    box.classList.add("flash");
    setTimeout(() => box.classList.remove("flash"), 350);

    box.scrollIntoView({ behavior: "smooth", block: "center" });
    eventBus.emit("unsavedChangesFlash", { timestamp: Date.now() });
    return;
}
function applySettings() {
    const sendBtnToggle = JSON.parse(localStorage.getItem("send-btn-toggle"));
    if (sendBtnToggle !== null) toggleSendButton(sendBtnToggle);
}
// Settings > Profile
function updateAvatarButtons() {
    const avatarInput = $("#avatar-input");
    const avatarBtnsContainer = $("#avatar-btns-container");
    avatarInput.replaceWith(avatarInput.cloneNode(true));
    avatarBtnsContainer.replaceWith(avatarBtnsContainer.cloneNode(true));
    const newAvatarInput = $("#avatar-input");
    const newAvatarBtnsContainer = $("#avatar-btns-container");
    newAvatarBtnsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("normal")) newAvatarInput.click();
        else if (e.target.classList.contains("remove")) {
            humans.self.avatar = humans.self.defaultAvatar;
            localStorage.setItem("profile", JSON.stringify({ ...humans.self, id: humans.self.id.toString() }));
            loadProfile(); updateAvatarButtons();
        }
    });
    newAvatarInput.addEventListener("change", () => {
        if (newAvatarInput.files.length > 0) {
            const file = newAvatarInput.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                humans.self.avatar = reader.result;
                localStorage.setItem("profile", JSON.stringify({ ...humans.self, id: humans.self.id.toString() }));
                loadProfile(); updateAvatarButtons();
            };
            eventBus.emit("fileInputChange", {
                file: file,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                timestamp: Date.now(),
            });
            reader.readAsDataURL(file);
        }
    });
    newAvatarBtnsContainer.querySelector(".remove").style.display = humans.self.avatar !== humans.self.defaultAvatar ? "inline-block" : "none";
}
function loadProfile() {
    $("#profile-picture").src = humans.self.avatar;
    $("#global-name").textContent = humans.self.name;
    $("#username").textContent = humans.self.status;
}
function saveProfile() {
    const name = $("#global-name-input").value || humans.self.name;
    const username = $("#username-input").value || humans.self.username;
    const status = $("#status-input").value || "Online";
    const avatarInput = $("#avatar-input");
    let avatar = humans.self.avatar;
    if (avatarInput.files.length > 0) {
        const reader = new FileReader();
        reader.onloadend = () => {
            humans.self = { ...humans.self, username, name, status, avatar: reader.result };
            localStorage.setItem("profile", JSON.stringify({ ...humans.self, id: humans.self.id.toString() }));
            loadProfile();
        };
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        humans.self = { ...humans.self, username, name, status, avatar };
        localStorage.setItem("profile", JSON.stringify({ ...humans.self, id: humans.self.id.toString() }));
        loadProfile();
    }
}
// Settings > Appearance
function toggleSendButton(isChecked) { $("#send-btn").classList.toggle("hidden", !isChecked); }
// Srttings > Utility
function toggleEmoticonConversion(isChecked) {
    localStorage.setItem("auto-convert-emoticons", isChecked);
}
function convertEmoticons(text) {
    if (!JSON.parse(localStorage.getItem("auto-convert-emoticons"))) { return text; }
    const sortedEmoticons = Object.keys(emoticonJson).sort((a, b) => b.length - a.length);
    const pattern = new RegExp(sortedEmoticons.map(e => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g");
    return text.replace(pattern, match => `:${emoticonJson[match]}:`);
}

function toggleAutoselectAutocomplete(isChecked) {
    localStorage.setItem("autoselect-in-autocomplete", isChecked);
}

// Settings > AutoMod
function saveAutomodSettings() {
    function escapeCommas(arr) { return arr.map(item => item.replace(/,/g, "\\,")); }
    AutoMod.user.strings = $("#automod-text-input").value.split(/\r?\n|,/).map(s => s.trim()).filter(Boolean);
    AutoMod.user.matches = $("#automod-regex-input").value.split(/\r?\n|,/).map(s => {
        try { return s.trim() ? new RegExp(s.trim(), "i") : null; } catch (e) { return null; }
    }).filter(Boolean);
    AutoMod.user.exceptions = $("#automod-exceptions-input").value.split(/\r?\n|,/).map(s => s.trim()).filter(Boolean);
    localStorage.setItem("userBlockedStrings", JSON.stringify(escapeCommas(AutoMod.user.strings)));
    localStorage.setItem("userBlockedMatches", JSON.stringify(escapeCommas(AutoMod.user.matches.map(r => r.source))));
    localStorage.setItem("userExceptions", JSON.stringify(escapeCommas(AutoMod.user.exceptions)));
}

// Settings > Loading
function toggleLoadingLine(isChecked) {
    localStorage.setItem("custom-line-enabled", isChecked);
}
function saveLoadingSettings() {
    localStorage.setItem("custom-loading-line", $("#line-input").value);
}

// Theme Setter
const VALID_THEMES = [
    "light",
    "dark",
    "darker",
    "midnight"
];
const THEME_ALIASES = {
    "ash": "dark",
    "onyx": "midnight",
};
function setTheme(theme) {
    theme = THEME_ALIASES[theme] || theme;
    if (!VALID_THEMES.includes(theme) && theme !== "system") return console.error("You must select a VALID theme from the following: \n" + VALID_THEMES);

    if (theme === "system") {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        console.log(`Successfully set theme to your preferred system theme, which is ${theme}.`);
    }

    const features = [
        { key: "clientTheme-enabled", class: "customColors", label: "custom client colors" },
        { key: "refresh-colors-enabled", class: "visual-refresh", label: "visual refresh colors" },
        { key: "refresh-ui-enabled", class: "visual-refresh-ui", label: "visual refresh UI elements" },
        { key: "underline-links-enabled", class: "always-underline-links", label: "links always underlined" },
        { key: "custom-saturation-colors-enabled", class: "desaturate-user-colors", label: "user colors desaturated" },
        { key: "high-contrast-enabled", class: "high-contrast-mode", label: "high color contrast" }
    ];

    const classes = [`theme-${theme}`], labels = [];
    for (const f of features) {
        const enabled = localStorage.getItem(f.key) === "true";
        document.documentElement.classList.toggle(f.class, enabled);
        if (enabled) { classes.push(f.class); labels.push(f.label); }
    }

    document.documentElement.className = classes.join(" ");
    localStorage.setItem("user-theme", theme);
    console.log(`Successfully set theme${labels.length ? " (" + labels.join(", ") + ")" : ""} to ${theme}!`);
}

// UserCSS
let UserCSS = $("#UserCSS");
if (!UserCSS) document.head.appendChild(el("style", { id: "UserCSS" }));

if (localStorage.getItem("UserCSS_Enabled") === "true") UserCSS.textContent = localStorage.getItem("UserCSS_Backup") || "";
window.addEventListener("message", e => {
    if (e.data?.type === "cssUpdate" && localStorage.getItem("UserCSS_Enabled") === "true") { UserCSS.textContent = e.data.css; }
});
function openEditor() { window.open("./css-editor.html", "_blank", "popup,width=800,height=600,resizable=yes"); }
function toggleUserCSS(isChecked) {
    localStorage.setItem("UserCSS_Enabled", isChecked);
    UserCSS.textContent = isChecked ? localStorage.getItem("UserCSS_Backup") || "" : "";
}
function toggleEditorMode(isChecked) {
    localStorage.setItem("UserCSS_Mode", isChecked ? "monaco" : "ace");
}


// Visual Refresh
function toggleRefreshColors(isChecked) {
    localStorage.setItem("refresh-colors-enabled", isChecked);
    document.documentElement.classList.toggle("visual-refresh", isChecked.toString());
    setTheme(localStorage.getItem("user-theme") || "dark");
}
function toggleRefreshUI(isChecked) {
    localStorage.setItem("refresh-ui-enabled", isChecked);
    document.documentElement.classList.toggle("visual-refresh-ui", isChecked.toString());
    setTheme(localStorage.getItem("user-theme") || "dark");
}

// Client Theme
function toggleClientTheme(isChecked) {
    localStorage.setItem("clientTheme-enabled", isChecked);
    document.documentElement.classList.toggle("customColors", isChecked.toString());
    setTheme(localStorage.getItem("user-theme") || "dark");
}
function hexToHSL(c) {
    c = c.replace("#", ""); if (c.length == 3) c = c.split("").map(x => x + x).join(""); let r = parseInt(c.slice(0, 2), 16) / 255, g = parseInt(c.slice(2, 4), 16) / 255, b = parseInt(c.slice(4, 6), 16) / 255, m = Math.max(r, g, b), n = Math.min(r, g, b), d = m - n, h, s, l = (m + n) / 2; if (!d) h = s = 0; else { s = d / (1 - Math.abs(2 * l - 1)); h = m == r ? ((g - b) / d) % 6 : m == g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360 } s *= 100; l *= 100; return { h, s, l }
}


let clientThemeVars = $("#clientThemeVars");
if (!clientThemeVars) { clientThemeVars = document.createElement("style"); clientThemeVars.id = "clientThemeVars"; document.head.appendChild(clientThemeVars); }
function updateColorVars(color) {
    if (color) {
        const { h, s, l } = hexToHSL(color), newContent = `:root { --theme-h: ${h}; --theme-s: ${s}%; --theme-l: ${l}%; }`;
        if (clientThemeVars.textContent !== newContent) { clientThemeVars.textContent = newContent; }
    } else {
        clientThemeVars.textContent = "";
    }
}
function brightness(hex) {
    const r = parseInt(hex.substr(1, 2), 16), g = parseInt(hex.substr(3, 2), 16), b = parseInt(hex.substr(5, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
}

// Accessibility
function changeSaturation(value) {
    document.documentElement.style.setProperty("--saturation-factor", value / 100);
}
function toggleLinkUnderlining(isChecked) {
    localStorage.setItem("underline-links-enabled", isChecked);
    document.documentElement.classList.toggle("always-underline-links", isChecked.toString());
    setTheme(localStorage.getItem("user-theme") || "dark");
}
function toggleSaturationCustom(isChecked) {
    localStorage.setItem("custom-saturation-colors-enabled", isChecked);
    document.documentElement.classList.toggle("desaturate-user-colors", isChecked.toString());
    setTheme(localStorage.getItem("user-theme") || "dark");
}
function toggleContrastMode(isChecked) {
    localStorage.setItem("high-contrast-enabled", isChecked);
    document.documentElement.classList.toggle("high-contrast-mode", isChecked.toString());
    setTheme(localStorage.getItem("user-theme") || "dark");
}

// Chat
function toggleTodayAt(isChecked) {
    localStorage.setItem("show-today-at", isChecked);
}

function toggleHeader(isChecked) {
    localStorage.setItem("show-header", isChecked);
    updateTitleHeader();
}

// Custom Role
function toggleUserRoleColor(isChecked) {
    localStorage.setItem("user-role-enabled", isChecked);
    let allNames = document.querySelectorAll(`.message[data-userid="${humans.self.id}"] .name`);
    if (isChecked) {
        let color = localStorage.getItem("user-role-color");
        let isValid = CSS.supports("color", color);
        allNames.forEach(name => name.style.color = isValid ? color : DEFAULT_COLOR);
    } else {
        allNames.forEach(name => name.style.color = DEFAULT_COLOR);
    }
}
function updateRoleColor(color) {
    let allNames = document.querySelectorAll(`.message[data-userid="${humans.self.id}"] .name`);
    let isValid = CSS.supports("color", color);
    allNames.forEach(name => name.style.color = isValid ? color : DEFAULT_COLOR);
    localStorage.setItem("user-role-color", isValid ? color : DEFAULT_COLOR);
}

if (EASTER_EGGS_ENABLED_DEVELOPMENT) {
    // const achievementManager = new Achievements("SparkleCord");
    eventBus.on("settingsLoaded", () => {
        const achievements = {
            // emoji achievements
            "golden_dandelion": { // use the :golden_dandelion: emoji
                displayName: "The Golden Dandelion",
                description: "You got the golden dandelion, which is a golden dandelion.",
                icon: "./assets/achievements/golden_dandelion.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 1,
                internalId: "golden_dandelion"
            },
            "matrix": { // use the :red_blue_pill: emoji
                displayName: "The Pill",
                description: "You take the blue pill, or you take the red pill.",
                icon: "./assets/achievements/redpill.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 1,
                internalId: "matrix"
            },
            "zelda": { // use the :ze_sword: emoji
                displayName: "It's dangerous to go alone! Take this.",
                description: "Sword Acquired.",
                icon: "./assets/achievements/sword.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 1,
                internalId: "zelda"
            },
            "captamerica": { // use the :capt_america_shield: emoji
                displayName: "I understood that reference",
                description: "I can do this all day.",
                icon: "./assets/achievements/reference.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 1,
                internalId: "captamerica"
            },

            // command achievements (PC EXCLUSIVE)
            "blindness": { // "lightmode" in the console
                displayName: "Blindness IV",
                description: "I warned you...",
                icon: "./assets/achievements/blindness.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 1,
                internalId: "blindness"
            },
            "2048game": { // "the2048" in the console
                displayName: "The coolest block game",
                description: "I love 2048 too.",
                icon: "./assets/achievements/2048.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 1,
                internalId: "2048game"
            },
            "myself": { // "doctoon" in the console
                displayName: "Hello Everybody, it's me.",
                description: `It's me, doctoon. And today we have a guest, it is... ${humans.self.name}! `,
                icon: "./assets/achievements/mypfp.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 1,
                internalId: "myself"
            },
            "illegal": { // "noclip" in the console
                displayName: "Wait, that's illegal.",
                description: "How'd you even do that?",
                icon: "./assets/achievements/what.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 1,
                internalId: "illegal"
            },

            // UI achievements (do specific things)
            "10th_visit": { // press the birthday mode tab 10 times, counter resets if you refresh
                displayName: "10th Visitor",
                description: "Congrats, you won a digital award for being the 10th visitor!",
                icon: "./assets/achievements/10th.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 10,
                internalId: "10th_visit"
            },
            "stop": { // ping everyone 10 times in less than a minute
                displayName: "Stop That!",
                description: "The notifications are driving me insane!",
                icon: "./assets/achievements/spam.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 10,
                internalId: "stop"
            },
            "keyboard_warrior": { // send 100 messages in 25 seconds, each message the timer decays by 200ms. so you have 5 seconds of slowness possible
                displayName: "Keyboard Warrior",
                description: "You probably have a world record WPM if I were to guess.",
                icon: "./assets/achievements/keyboard_warrior.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 100,
                internalId: "keyboard_warrior"
            },
            "demure": { // wrap at least one of your words like ✨💖this💖✨
                displayName: "Very Demure, Very Mindful",
                description: "✨",
                icon: "./assets/achievements/verydemure.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 1,
                internalId: "demure"
            },
            "f": { // react with :regional_indicator_f:
                displayName: "Press F to pay respects",
                description: "React with honor.",
                icon: "./assets/achievements/f.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 1,
                internalId: "f"
            },
            "shouldnt_pass": { // send an automodded message
                displayName: "You shall not pass!",
                description: "The message has failed to be received, press F to know more.",
                icon: "./assets/achievements/lotr.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 1,
                internalId: "shouldnt_pass"
            },
            "noplacelikehome": { // refresh sparklecord 5 times in 1 minute
                displayName: "There's no place like home.",
                description: "It's so nice to be here.",
                icon: "./assets/achievements/home.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 5,
                internalId: "noplacelikehome"
            },
            "groot": { // say 2 or more words in a message, each word has to be the same word (e.g. the achievement description here)
                displayName: "I am groot",
                description: "groot groot groot groot groot",
                icon: "./assets/achievements/groot.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 1,
                internalId: "groot"
            },
            "konami": { // press ArrowUp+ArrowUp+ArrowDown+ArrowDown+ArrowLeft+ArrowRight+ArrowLeft+ArrowRight+B+A, PC only, and in that exact order
                displayName: "The Konami Code",
                description: "You might know this from the Gradius port on the NES.",
                icon: "./assets/achievements/konami.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 1,
                internalId: "konami"
            },
            "off": { // turn off birthday mode, and in the same session re-enable it
                displayName: "Aaaand... OFF!",
                description: "Maybe it'll restart better this time.",
                icon: "./assets/achievements/off.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 1,
                internalId: "off"
            },

            // neutral achievements (unlocked in 2 or more ways)
            "ilyt": { // "love" in the console, or :box_of_chocolates:
                displayName: "I love you too",
                description: "<3",
                icon: "./assets/achievements/love.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 1,
                internalId: "ilyt"
            },
            "birthday": { // "birthday" in the console, or :sparkle:
                displayName: "Happy Birthday!",
                description: "Did you know SparkleCord is two years old? Development started in February 29th, 2024.",
                icon: "./assets/achievements/bday.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 1,
                internalId: "birthday"
            },
            "cake": { // "cake" in the cnosole, or :sparklecake:
                displayName: "The Cake was a Lie",
                description: "Unfortunately Portal 1 was right on this one",
                icon: "./assets/achievements/sparklecake.png",

                unlocked: false,
                currentProgress: 0,
                progresMax: 1,
                internalId: "cake"
            }
        };

        const html = Object.entries(achievements).map(([id, achievement]) => `
                <div class="settings-achievement">
                    <div class="settings-achievement-icon"><img src="${achievement.icon}"></div>
                    <div class="settings-achievement-content">
                        <div class="settings-achievement-label">${achievement.displayName}</div>
                        <div class="settings-achievement-description">${achievement.description}</div>
                        <div class="settings-achievement-progress">
                            <div class="settings-achievement-progressBar">
                                <div class="settings-achievement-progressFill" style="width: ${achievement.currentProgress}%;"></div>
                            </div>
                            <div class="settings-achievement-progressText">${achievement.currentProgress}%</div>
                        </div>
                    </div>
                </div>
            `
        ).join("\n");

        $("#settings-achievements-grid").innerHTML = html;
    });
}
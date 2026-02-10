class EventBus {
    constructor() {
        this.listeners = {};
    }

    on(event, callback, id = "") {
        if (!this.listeners[event]) {
            this.listeners[event] = { callbacks: [], ids: {} };
        }

        this.listeners[event].callbacks.push(callback);
        if (id) this.listeners[event].ids[id] = callback;
    }

    emit(event, data) {
        const listeners = this.listeners[event];
        if (!listeners) return;

        listeners.callbacks.forEach(cb => cb(data));
    }

    off(event, id) {
        const listeners = this.listeners[event];
        if (!listeners || !listeners.ids[id]) return;

        listeners.callbacks = listeners.callbacks.filter(cb => cb !== listeners.ids[id]);
        delete listeners.ids[id];
    }
}

class PluginManager {
    static create(plugin) {
        const cog = "M10.56 1.1c-.46.05-.7.53-.64.98.18 1.16-.19 2.2-.98 2.53-.8.33-1.79-.15-2.49-1.1-.27-.36-.78-.52-1.14-.24-.77.59-1.45 1.27-2.04 2.04-.28.36-.12.87.24 1.14.96.7 1.43 1.7 1.1 2.49-.33.8-1.37 1.16-2.53.98-.45-.07-.93.18-.99.64a11.1 11.1 0 0 0 0 2.88c.06.46.54.7.99.64 1.16-.18 2.2.19 2.53.98.33.8-.14 1.79-1.1 2.49-.36.27-.52.78-.24 1.14.59.77 1.27 1.45 2.04 2.04.36.28.87.12 1.14-.24.7-.95 1.7-1.43 2.49-1.1.8.33 1.16 1.37.98 2.53-.07.45.18.93.64.99a11.1 11.1 0 0 0 2.88 0c.46-.06.7-.54.64-.99-.18-1.16.19-2.2.98-2.53.8-.33 1.79.14 2.49 1.1.27.36.78.52 1.14.24.77-.59 1.45-1.27 2.04-2.04.28-.36.12-.87-.24-1.14-.96-.7-1.43-1.7-1.1-2.49.33-.8 1.37-1.16 2.53-.98.45.07.93-.18.99-.64a11.1 11.1 0 0 0 0-2.88c-.06-.46-.54-.7-.99-.64-1.16.18-2.2-.19-2.53-.98-.33-.8.14-1.79 1.1-2.49.36-.27.52-.78.24-1.14a11.07 11.07 0 0 0-2.04-2.04c-.36-.28-.87-.12-1.14.24-.7.96-1.7 1.43-2.49 1.1-.8-.33-1.16-1.37-.98-2.53.07-.45-.18-.93-.64-.99a11.1 11.1 0 0 0-2.88 0ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z";
        const info = "M23 12a11 11 0 1 1-22 0 11 11 0 0 1 22 0Zm-9.5-4.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm-.77 3.96a1 1 0 1 0-1.96-.42l-1.04 4.86a2.77 2.77 0 0 0 4.31 2.83l.24-.17a1 1 0 1 0-1.16-1.62l-.24.17a.77.77 0 0 1-1.2-.79l1.05-4.86Z";

        const card = document.createElement("div");
        card.classList.add("vc-addon-card");
        if (plugin.disabled) card.classList.add("disabled");
        card.innerHTML = `
            <div class="vc-addon-header">
                <div class="vc-addon-name-author">
                    <div class="vc-addon-name">
                        <div class="vc-addon-title-container">
                            <div class="vc-addon-title">${plugin.name}</div>
                        </div>
                    </div>
                </div>
                <button role="switch">
                    <svg class="plugins-info-icon" role="img" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" fill-rule="evenodd" d="${plugin.settings && plugin.settings.length > 0 ? cog : info}" clip-rule="evenodd"></path>
                    </svg>
                </button>
                <div class="visual-refresh-ui">
                    <label class="switch">
                        <input type="checkbox" id="plugin_${plugin.name}-toggle"> <span class="slider"></span>
                    </label>
                </div>
            </div>
            <div class="vc-addon-note">${plugin.description}</div>
        `;
        document.querySelector(".vc-plugins-grid").appendChild(card);
        const btn = card.querySelector("button[role='switch']");
        btn.addEventListener("click", () => PluginManager.openModal(plugin));
    }
    static openModal(plugin) {
        const modalContainer = document.querySelector(".layerContainer_da8173");

        document.addEventListener("keydown", e => {
            if (e.key === KEYBIND_CLOSE) { modalContainer.style.display = "none"; }
        });

        document.querySelector("#\\:r2tl\\: > div").innerHTML = plugin.name;
        document.querySelector(".vc-plugin-modal-info > div").innerHTML = plugin.description;

        let optionsHTML = "";
        if (plugin.settings && plugin.settings.length > 0) {
            plugin.settings.forEach(opt => {
                if (SettingsManager.types[opt.type]) {
                    optionsHTML += SettingsManager.types[opt.type](opt);
                }
                if (SettingsManager.binders[opt.type]) {
                    SettingsManager.binders[opt.type](opt);
                }
            });
        }

        if (!optionsHTML) {
            $("#modal-settings-container").innerHTML = "";
        } else {
            $("#modal-settings-container").innerHTML = optionsHTML;
        }

        PluginManager.loadPluginSettings(plugin);

        modalContainer.style.display = "block";

        $(".footer__49fc1 button.remove", false, modalContainer).onclick = () => modalContainer.style.display = "none";
        $(".closeIcon__49fc1", false, modalContainer).onclick = () => modalContainer.style.display = "none";

        $(".footer__49fc1 .button:not(.remove)", false, modalContainer).onclick = () => {
            PluginManager.savePluginSettings(plugin);
            modalContainer.style.display = "none";
        };
    }

    static savePluginSettings(plugin) {
        if (!plugin || !plugin.name) { console.error("Invalid plugin provided for saving settings"); return; }

        const settings = {};
        if (plugin.settings) {
            plugin.settings.forEach(setting => {
                if (!setting.id) return;
                const element = $(`#${setting.id}`);
                if (!element) return;
                let value;
                switch (setting.type) {
                    case "toggle":
                    case "checkbox":
                        value = element.checked;
                        break;
                    case "color":
                    case "text":
                    case "textarea":
                    case "slider":
                        value = element.value;
                        break;
                    case "file":
                    case "radio":
                        return;
                    default:
                        value = element.value;
                }
                if (value !== undefined) {
                    settings[setting.id] = value;
                    if (setting.onInput && (setting.type === "text" || setting.type === "textarea" || setting.type === "slider")) {
                        setting.onInput(value);
                    } else if (setting.onToggle && (setting.type === "toggle" || setting.type === "checkbox")) {
                        setting.onToggle(value);
                    } else if (setting.onChange && setting.type === "radio") {
                        setting.onChange(value);
                    } else if (setting.onColorSelect && setting.type === "color") {
                        setting.onColorSelect(value);
                    }
                }
            });
        }
        
        localStorage.setItem(`PLUGIN__${plugin.name}-settings`, JSON.stringify(settings));
    }
    static loadPluginSettings(plugin) {
        if (!plugin || !plugin.name) { console.error("Invalid plugin provided for loading settings"); return null; }
        const savedSettings = localStorage.getItem(`PLUGIN__${plugin.name}-settings`); 
        if (!savedSettings) return null;
        try {
            const settings = JSON.parse(savedSettings);
            if (plugin.settings) {
                plugin.settings.forEach(setting => {
                    if (!setting.id || settings[setting.id] === undefined) return;
                    const element = $(`#${setting.id}`);
                    if (!element) return;
                    const value = settings[setting.id];
                    switch (setting.type) {
                        case "toggle":
                        case "checkbox":
                            element.checked = value;
                            if (setting.onToggle) setting.onToggle(value);
                            break;
                        case "color":
                            element.value = value;
                            if (setting.onColorSelect) setting.onColorSelect(value);
                            break;
                        case "text":
                        case "textarea":
                        case "slider":
                            element.value = value;
                            if (setting.onInput) setting.onInput(value);
                            break;
                        default:
                            element.value = value;
                    }
                });
            }
            return settings;
        } catch (e) { console.error(`Failed to parse settings for ${plugin.name}:`, e); return null; }
    }
    static plugins = [
        { 
            name: "SparkleHook", description: "Send messages to Discord through your webhooks.",
            settings: [
                { 
                    type: "nameAndDesc",
                    name: "Webhook URL",
                    description: "The webhook URL to connect to, this is only used to send messages.",
                },
                { type: "text", id: "SparkleHook_WHURL", placeholder: "https://discord.com/api/webhooks/..." },
            ],
            onEnable: () => {
                const settings = PluginManager.loadPluginSettings(PluginManager.plugins.find(p => p.name === "SparkleHook"));
                let webhookURL = settings?.SparkleHook_WHURL || "";
                webhookURL = SparkleHook.core.parseWebhook(webhookURL);
                eventBus.on("msgSend", async ({ messageData }) => {
                    try {
                        await SparkleHook.logic.handleMessageSend({ messageData, webhookURL });
                    } catch (error) { console.error("SparkleHook failed:", error); }
                }, "SparkleHook_humanSend");
                eventBus.on("systemMessageSent", async ({ messageData, runData }) => {
                    try {
                        const response = await SparkleHook.logic.handleSystemMessage({ messageData, runData, webhookURL });
                        if (!response.ok) { console.error(`HTTP ${response.status}:`, await response.text()); }
                    } catch (err) { console.error("SparkleHook failed:", err); }
                }, "SparkleHook_systemSend");
            },
            onDisable: () => {
                eventBus.off("msgSend", "SparkleHook_humanSend");
                eventBus.off("systemMessageSent", "SparkleHook_systemSend");
            },
        },
       // { name: "Plugin With No Options", description: "This plugin doesn't require additional user-provided values." },
       // { name: "Disabled Option", description: "Coming Soon...", disabled: true },
    ]
    static init() {
        PluginManager.plugins.forEach(plugin => {
            PluginManager.create(plugin);

            const toggle = $(`#plugin_${plugin.name}-toggle`);
            toggle.addEventListener("change", (e) => {
                 if (e.target.checked) {
                     plugin.onEnable();
                     localStorage.setItem(`PLUGIN__${plugin.name}-enabled`, true);
                 } else {
                     plugin.onDisable();
                     localStorage.setItem(`PLUGIN__${plugin.name}-enabled`, false);
                 }
            });

            const enableState = localStorage.getItem(`PLUGIN__${plugin.name}-enabled`);
            if (enableState === "true") {
                toggle.checked = true;
                plugin.onEnable?.();
            } else {
                toggle.checked = false;
                plugin.onDisable?.();
            }
        });
    }
}

const eventBus = new EventBus();

eventBus.on("loaded", () => {
    PluginManager.init();
});

/* All Events:
    "loaded" – When the loading screen is hidden (timestamp).
    "isTyping" – When a user starts typing (text, startTimestamp).
    "isTypingStop" – When a user stops typing (text, timestamp).

    "msgSend" – When a message is sent (messageElement, messageData).
    "msgContextMenu" – When the message context menu is opened (msg, timestamp).
    "msgDelete" – When a message is deleted (msg, timestamp).
    "msgEdit" – When a message is edited (msgBefore, msgAfter, timestamp).
    "msgReply" – When a message is replied to (originalMsg, replyMsg, timestamp).

    "systemMessageSent" - When a non-humans.self message gets sent (messageElement, runData, messageData).

    "settingsOpened" – When settings are opened (timestamp).
    "settingsTabSwitch" – When a settings tab is switched (timestamp, from, to).
    "unsavedChangesFlash" – When unsaved changes flash (timestamp).
    "settingsClosed" – When settings are closed (timestamp).
    "settingsChanged" – When settings are changed (before, after, option, optionSection, timestamp).
    "settingsReset" – When settings are reset to before the unsaved changes (option, optionSection, defaultValue, timestamp)
*/
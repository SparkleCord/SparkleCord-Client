class SettingsManager {
    static types = {
        // Info Displays
        "info": (opt) => `<p class="small-normal" ${opt.style ? `style="${opt.style}"` : ""}>${opt.label}</p>`,
        "info-title": (opt) => `<p class="eyebrow" style=${opt.style ? opt.style : "margin-bottom: -10px;"}>${opt.label}</p>`,
        "info-warning": (opt) => `<p class="small-danger" ${opt.style ? `style="${opt.style}"` : ""}>${opt.label}</p>`,
        "separator": () => "<div class='separator'></div>",
        "label": (opt) => `${parseMarkdown(opt.text)}`,

        // Toggle Switch
        "toggle": (opt) => {
            const isChecked = JSON.parse(localStorage.getItem(opt.id)) ?? (opt.defaultState === "on");
            const isDisabled = (opt.dependsOn && !(JSON.parse(localStorage.getItem(opt.dependsOn)) ?? false)) || opt.disabled === true;
            return `
            <div class="toggle-container${isDisabled ? " disabled" : ""}" ${opt.hideIf ? `data-hidecondition="${opt.hideIf}"` : ""}>
                <span class="label-text">${parseMarkdown(opt.label)}</span>
                <label class="switch">
                    <input type="checkbox" id="${opt.id}"
                        ${isChecked ? "checked" : ""} 
                        ${isDisabled ? "disabled" : ""} 
                        ${opt.dependsOn ? `data-depends-on="${opt.dependsOn}"` : ""}
                        ${opt.disabled ? "data-force-disabled" : ""}>
                    <span class="slider"></span>
                </label>
                ${opt.description ? `<p class="small-normal">${parseMarkdown(opt.description)}</p>` : ""}
            </div>`;
        },

        // Custom HTML
        "custom": (opt) => opt.html,

        // File Upload
        "file": (opt) => `
        <label for="${opt.id}">${opt.label}</label>
        <input type="file" id="${opt.id}" ${opt.accept ? `accept="${opt.accept}"` : ""} style="display: none;">
        <div class="buttons" id="${opt.containerId}">
            <button class="normal">${opt.changeLabel}</button>
            <button class="remove" style="display: none;">${opt.removeLabel}</button>
        </div>`,

        // Text Input
        "text": (opt) => opt.multiline // Check if the option is multiline
            ? `${opt.label ? `<label for="${opt.id}">${opt.label}</label>` : ""}<div class="textarea-container"><textarea class="settings-textarea" ${opt.placeholder ? `placeholder="${opt.placeholder}"` : ""} id="${opt.id}"></textarea><span class="charcount">0</span></div>` // If it is multiline

            : `${opt.label ? `<label for="${opt.id}">${opt.label}</label>` : ""}<input type="text" ${opt.placeholder ? `placeholder="${opt.placeholder}"` : ""} id="${opt.id}">`, // Else if it isn't multiline

        // Slider
        "slider": (opt) => {
            const defaultValue = opt.defaultValue || "0";
            const [min, max] = [opt.min || "0", opt.max || "100"], ratio = ((defaultValue - min) / (max - min)) * 100;

            return `<input type="range" value="${defaultValue}" min="${min}" max="${max}" id="${opt.id}" class="rangeSlider" 
            style="background: linear-gradient(90deg, var(--control-brand-foreground-new) ${ratio}%, var(--interactive-muted) ${ratio}%)" />`;
        },

        // Radio Group
        "radio": (opt) => {
            let html = `<div class="radiogroup">`;
            let isCheckedSet = false;

            opt.buttons.forEach(btn => {
                const isChecked = JSON.parse(localStorage.getItem(`${btn.id}-input`)) ?? (btn.default === "true" && !isCheckedSet);
                if (isChecked) isCheckedSet = true;
                html += `
                <div class="radio-btn" id="${btn.id}">
                    <input type="radio" name="${opt.id}" ${isChecked ? "checked" : ""} id="${btn.id}-input">
                    <span class="radio-text">${btn.name}</span>
                    <span class="radio-circle"></span>
                </div>`;
            });

            html += `</div>`;
            return html;
        },

        // Button
        "btn": (opt) => {
            let buttonClasses = `button ${opt.buttonType || ""}`;
            if (opt.filled && !opt.inverted) buttonClasses += " filled";
            if (opt.inverted) buttonClasses += " inverted";
            return `<button class="${buttonClasses}" id="${opt.id}">${opt.text}</button>`;
        },

        // Color Picker
        "color": (opt) => {
            const savedColor = localStorage.getItem(`${opt.id}-input`) || "#7289DA";
            return `
            <div class="color-picker" id="${opt.id}">
                <svg class="color-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="primary-530" d="m13.96 5.46 4.58 4.58a1 1 0 0 0 1.42 0l1.38-1.38a2 2 0 0 0 0-2.82l-3.18-3.18a2 2 0 0 0-2.82 0l-1.38 1.38a1 1 0 0 0 0 1.42ZM2.11 20.16l.73-4.22a3 3 0 0 1 .83-1.61l7.87-7.87a1 1 0 0 1 1.42 0l4.58 4.58a1 1 0 0 1 0 1.42l-7.87 7.87a3 3 0 0 1-1.6.83l-4.23.73a1.5 1.5 0 0 1-1.73-1.73Z"></path>
                </svg>
                <input type="color" id="${opt.id}-input" value="${savedColor}">
            </div>`;
        },

        // PLUGIN MODAL ONLY !
        "nameAndDesc": (opt) => {
            return `
            <div>
                <h2 class="eyebrow">${opt.name}</h2>
                <div class="opt-description">${opt.description}</div>
            </div>`
        }
    }

    // Event Listeners/Binders
    static binders = {
        "radio": (opt) => {
            opt.buttons.forEach(btn => {
                if (btn.onClick) {
                    setTimeout(() => {
                        $(`#${btn.id}`).addEventListener("click", (e) => {
                            const radio = e.target.closest("div.radio-btn").querySelector("input[type='radio']");
                            opt.buttons.forEach(b => localStorage.setItem(`${b.id}-input`, "false"));
                            radio.checked = true;
                            localStorage.setItem(radio.id, "true");
                            btn.onClick();
                        });
                    }, SETTINGS_TIMEOUT);
                }
            });
        },
        "btn": (opt) => {
            if (opt.onClick) {
                setTimeout(() => { $(`[id='${opt.id}']`).addEventListener("click", () => opt.onClick()); }, SETTINGS_TIMEOUT);
            }
        },
        "color": (opt) => {
            setTimeout(() => {
                const input = $(`[id='${opt.id}-input']`);
                input.addEventListener("input", e => {
                    const bright = "var(--white-500)", dark = "black";
                    const svg = input.parentElement.querySelector("path");
                    svg.setAttribute("fill", brightness(e.target.value) < 210 ? bright : dark);

                    if (opt.autosave !== false) {
                        localStorage.setItem(`${opt.id}-input`, input.value);
                        opt.onColorSelect?.(input.value);
                        hasUnsavedChanges = false;
                    } else {
                        currentSettings[opt.id] = input.value;
                        checkForChanges();
                    }
                    emitSettingsChange(opt, findOptionSection(opt.id), input.value);
                });
                input.dispatchEvent(new Event("input", { bubbles: true }));
                opt.onColorSelect?.(input.value);
            }, SETTINGS_TIMEOUT);
        }
    }
}
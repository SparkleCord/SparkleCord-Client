class MessageHoverButtons {
    constructor(mA) {
        this.hoverButtons = [
            {id:"hover-edit",action:msg=>mA.editMessage(msg),icon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="m13.96 5.46 4.58 4.58a1 1 0 0 0 1.42 0l1.38-1.38a2 2 0 0 0 0-2.82l-3.18-3.18a2 2 0 0 0-2.82 0l-1.38 1.38a1 1 0 0 0 0 1.42ZM2.11 20.16l.73-4.22a3 3 0 0 1 .83-1.61l7.87-7.87a1 1 0 0 1 1.42 0l4.58 4.58a1 1 0 0 1 0 1.42l-7.87 7.87a3 3 0 0 1-1.6.83l-4.23.73a1.5 1.5 0 0 1-1.73-1.73Z"/></svg>`, selfOnly: true },

            {id:"hover-reply",action:msg=>mA.replyTo(msg),icon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M2.3 7.3a1 1 0 0 0 0 1.4l5 5a1 1 0 0 0 1.4-1.4L5.42 9H11a7 7 0 0 1 7 7v4a1 1 0 1 0 2 0v-4a9 9 0 0 0-9-9H5.41l3.3-3.3a1 1 0 0 0-1.42-1.4l-5 5Z"/></svg>`},

            {id:"hover-more",action:(msg,e)=>{const event=new MouseEvent("contextmenu",{bubbles:true,clientX:e.clientX,clientY:e.clientY});Object.defineProperty(event,"isSynthetic",{value:true});msg.dispatchEvent(event)},icon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M4 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" clip-rule="evenodd"></path></svg>`}
        ];
        this.hoverButtonsShift = [
            {id:"hover-id",action:msg=>mA.copyID(msg),icon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M15.3 14.48c-.46.45-1.08.67-1.86.67h-1.39V9.2h1.39c.78 0 1.4.22 1.86.67.46.45.68 1.22.68 2.31 0 1.1-.22 1.86-.68 2.31Z"/><path fill="currentColor" fill-rule="evenodd" d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm1 15h2.04V7.34H6V17Zm4-9.66V17h3.44c1.46 0 2.6-.42 3.38-1.25.8-.83 1.2-2.02 1.2-3.58s-.4-2.75-1.2-3.58c-.79-.83-1.92-1.25-3.38-1.25H10Z" clip-rule="evenodd"/></svg>`},

            {id:"hover-edit",action:msg=>mA.editMessage(msg),icon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="m13.96 5.46 4.58 4.58a1 1 0 0 0 1.42 0l1.38-1.38a2 2 0 0 0 0-2.82l-3.18-3.18a2 2 0 0 0-2.82 0l-1.38 1.38a1 1 0 0 0 0 1.42ZM2.11 20.16l.73-4.22a3 3 0 0 1 .83-1.61l7.87-7.87a1 1 0 0 1 1.42 0l4.58 4.58a1 1 0 0 1 0 1.42l-7.87 7.87a3 3 0 0 1-1.6.83l-4.23.73a1.5 1.5 0 0 1-1.73-1.73Z"/></svg>`, selfOnly: true },

            {id:"hover-reply",action:msg=>mA.replyTo(msg),icon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M2.3 7.3a1 1 0 0 0 0 1.4l5 5a1 1 0 0 0 1.4-1.4L5.42 9H11a7 7 0 0 1 7 7v4a1 1 0 1 0 2 0v-4a9 9 0 0 0-9-9H5.41l3.3-3.3a1 1 0 0 0-1.42-1.4l-5 5Z"/></svg>`},

            {id:"hover-delete",action:msg=>mA.deleteMessage(msg),icon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M14.25 1c.41 0 .75.34.75.75V3h5.25c.41 0 .75.34.75.75v.5c0 .41-.34.75-.75.75H3.75A.75.75 0 0 1 3 4.25v-.5c0-.41.34-.75.75-.75H9V1.75c0-.41.34-.75.75-.75h4.5Z"/><path fill="currentColor" fill-rule="evenodd" d="M5.06 7a1 1 0 0 0-1 1.06l.76 12.13a3 3 0 0 0 3 2.81h8.36a3 3 0 0 0 3-2.81l.75-12.13a1 1 0 0 0-1-1.06H5.07ZM11 12a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0v-6Zm3-1a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Z" clip-rule="evenodd"/></svg>`,destructive: true, selfOnly: true }
        ];
        this.shiftPressed = false;
        this.init();
    }
    init() {
        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    node.querySelectorAll?.(".message").forEach(msg => {
                        if (!msg.querySelector(".edit-box") && !msg.querySelector(".eyecon")) {
                            this.addHoverButtons(msg);
                            let container = msg.querySelector(`#hover-${msg.getAttribute("data-id")}`), items = container.querySelectorAll(".hover-btn");
                            items.forEach(item => {
                                if (item.getAttribute("data-self") === "true") {
                                    if (humans.self.id.toString() !== msg.getAttribute("data-userid")) item.style.display = "none";
                                    else item.removeAttribute("style");
                                }
                            });
                        }
                    });
                });                
            });
        }).observe($("messages"), { childList: true, subtree: true });

        document.addEventListener("keydown", e => { if (e.key === "Shift" && !this.shiftPressed) this.toggleShift(true); });
        document.addEventListener("keyup", e => { if (e.key === "Shift") this.toggleShift(false); });
        window.addEventListener("blur", () => this.toggleShift(false));
        
    }
    toggleShift(state) {
        this.shiftPressed = state;
        document.querySelectorAll(".hover-buttons").forEach(container => {
            const msg = container.closest(".message");
            if (msg.querySelector(".edit-box") || msg.querySelector(".eyecon")) return container.remove();
            container.innerHTML = "";
            (state ? this.hoverButtonsShift : this.hoverButtons).forEach((item) => {
                const btn = this.createHoverButton(item.id, item.icon, (e) => item.action(msg, e), item.destructive, item.selfOnly);
                if (item.selfOnly && humans.self.id.toString() !== msg.getAttribute("data-userid")) btn.style.display = "none";
                container.appendChild(btn);
            });
        });
    }
    addHoverButtons(msg) {
        if (msg.querySelector(".hover-buttons") || msg.querySelector(".eyecon")) return;
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "hover-buttons"; buttonContainer.id = `hover-${msg.getAttribute("data-id")}`;
        (this.shiftPressed ? this.hoverButtonsShift : this.hoverButtons).forEach((item) => {
            buttonContainer.appendChild(this.createHoverButton(item.id, item.icon, (e) => item.action(msg, e), item.destructive, item.selfOnly));
        });
        msg.appendChild(buttonContainer);
        new MutationObserver(() => {
            if (msg.querySelector(".edit-box") || msg.querySelector(".eyecon")) { buttonContainer.remove(); return; }
            if (!msg.querySelector(".hover-buttons")) msg.appendChild(buttonContainer);
        }).observe(msg, { childList: true, subtree: true, attributes: true });
    }
    createHoverButton(id, icon, action, destructive = false, selfOnly = false) {
        const btn = document.createElement("button");

        if (selfOnly === true) { btn.setAttribute("data-self", "true") }

        btn.className = `hover-btn ${destructive ? "danger" : ""}`; btn.id = id; btn.addEventListener("click", action);
        if (icon.startsWith("<svg")) { btn.innerHTML = icon;} else if (icon.match(/\.(svg)$/i)) {
            console.error("PLEASE use inline SVG! SVG files are no longer supported for context/hover menus.")
        }
        return btn;
    }
}
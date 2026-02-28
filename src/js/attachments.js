const fileTypes = {
    // adobe
    acrobat: {
        extensions: [".pdf"],
        mimeTypes: [],
        icon: "acrobat",
        renderMode: "generic"
    },
    aftereffects: {
        extensions: [".aep", ".aepx", ".aet"],
        mimeTypes: [],
        icon: "ae",
        renderMode: "generic"
    },
    illustrator: {
        extensions: [".ai", ".ait"],
        mimeTypes: [],
        icon: "ai",
        renderMode: "generic"
    },
    photoshop: {
        extensions: [".psd", ".psb"],
        mimeTypes: ["image/vnd.adobe.photoshop"],
        icon: "ps",
        renderMode: "generic"
    },

    // text files
    code: { 
        extensions: [".c++", ".cpp", ".cc", ".c", ".h", ".hpp", ".mm", ".m", ".json", ".js", ".ts", ".rb", ".rake", ".py", ".asm", ".fs", ".pyc", ".dtd", ".cgi", ".bat", ".rss", ".java", ".graphml", ".idb", ".lua", ".o", ".gml", ".prl", ".sls", ".conf", ".cmake", ".make", ".sln", ".vbe", ".cxx", ".wbf", ".vbs", ".r", ".wml", ".php", ".bash", ".applescript", ".fcgi", ".yaml", ".ex", ".exs", ".sh", ".ml", ".actionscript"],
        mimeTypes: [],
        icon: "code",
        renderMode: "text"
    },
    document: { 
        extensions: [".txt", ".rtf", ".doc", ".docx", ".md", ".pages", ".ppt", ".pptx", ".pptm", ".key", ".log"],
        mimeTypes: [],
        icon: "document",
        renderMode: "text"
    },
    webcode: { 
        extensions: [".html", ".xhtml", ".htm", ".xml", ".xsd", ".css", ".styl", ".svg"],
        mimeTypes: ["image/svg+xml"],
        icon: "webcode",
        renderMode: "text"
    },

    // binary files
    archive: { 
        extensions: [".rar", ".zip", ".7z", ".tar", ".tar.gz"],
        mimeTypes: [],
        icon: "archive",
        renderMode: "generic"
    },
    audio: { 
        extensions: [".mp3", ".ogg", ".opus", ".wav", ".aiff", ".flac"],
        mimeTypes: [],
        icon: "audio",
        renderMode: "audio"
    },
    image: { 
        extensions: [],
        mimeTypes: ["image/*"],
        icon: "image",
        renderMode: "image"
    },
    spreadsheet: {
        extensions: [".xls", ".xlsx", ".numbers"],
        mimeTypes: [],
        icon: "spreadsheet",
        renderMode: "generic"
    },
    csv: {
        extensions: [".csv"],
        mimeTypes: [],
        icon: "spreadsheet",
        renderMode: "text"
    },
    video: {
        extensions: [],
        mimeTypes: ["video/*"],
        icon: "video",
        renderMode: "video"
    },

    // others
    sketch: {
        extensions: [".sketch"],
        mimeTypes: [],
        icon: "sketch",
        renderMode: "generic"
    },
    unknown: { 
        extensions: [],
        mimeTypes: [],
        icon: "unknown",
        renderMode: "generic"
    }
}

class AttachmentHandler {
    static createPreview(file) {
        const attachment = {
            data: {
                id: `attach-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                file: file,
                name: file.name,
                type: file.type,
                size: file.size,

                internalType: AttachmentHandler.getRenderMode(file.type, file.name)
            }
        }

        attachment.id = attachment.data.id;

        const attachmentDiv = el("div", { className: "attachment-wrapper", dataset: { attachId: attachment.id } });
        currentAttachments.push(attachment.data);

        const nameInput = el("input", { type: "text", value: file.name, className: "attachment-name" });
        const removeBtn = el("button", { className: "remove-attachment", innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M14.25 1c.41 0 .75.34.75.75V3h5.25c.41 0 .75.34.75.75v.5c0 .41-.34.75-.75.75H3.75A.75.75 0 0 1 3 4.25v-.5c0-.41.34-.75.75-.75H9V1.75c0-.41.34-.75.75-.75h4.5Z"></path><path fill="currentColor" fill-rule="evenodd" d="M5.06 7a1 1 0 0 0-1 1.06l.76 12.13a3 3 0 0 0 3 2.81h8.36a3 3 0 0 0 3-2.81l.75-12.13a1 1 0 0 0-1-1.06H5.07ZM11 12a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0v-6Zm3-1a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Z" clip-rule="evenodd"></path></svg>` });
        attachmentDiv.appendChild(removeBtn);

        if (file.type.startsWith("image/")) {
            attachmentDiv.classList.add("media");
            attachmentDiv.appendChild(el("img", { src: URL.createObjectURL(file) }));
        } else if (file.type.startsWith("video/")) {
            attachmentDiv.classList.add("media-video");
            attachmentDiv.appendChild(el("video", { src: URL.createObjectURL(file) }));
        } else {
            attachmentDiv.classList.add("file-other");
            attachmentDiv.appendChild(el("img", { src: AttachmentHandler.getFileIcon(file.type, file.name), className: "file-icon" }));
        }

        removeBtn.addEventListener("click", () => { 
            currentAttachments = currentAttachments.filter(a => a.id !== attachment.id); attachmentDiv.remove();
            updateSendButtonColor({ attachments: currentAttachments });
        });

        nameInput.addEventListener("change", () => {
            const att = currentAttachments.find(a =>a.id === attachment.id);
            
            if (att) {
                att.name = nameInput.value;
            }
        });

        attachmentDiv.appendChild(nameInput);
        $("#attachment-preview-container").appendChild(attachmentDiv);
        updateSendButtonColor({ attachments: currentAttachments });
    }

    static handleAttachment() {
        const fileInput = el("input", { type: "file", multiple: true, style: "display: none;" });

        fileInput.addEventListener("change", (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;

            let filteredFiles = [];
            files.forEach(file => {
                let warning = "";
                const megabytes = file.size / (1024 * 1024);

                if (megabytes > 50) {
                    warning = `${file.name} (${AttachmentHandler.formatSize(file.size)}) is bigger than 50MB! Your browser may crash.`;
                } else if (megabytes > 25) {
                    warning = `${file.name} (${AttachmentHandler.formatSize(file.size)}) is bigger than 25MB! There may be significant amounts of lag.`;
                } else if (megabytes > 10) {
                    warning = `${file.name} (${AttachmentHandler.formatSize(file.size)}) is bigger than 10MB! Some lag might happen.`;
                }

                if (warning) {
                    if (!confirm(`${warning}\n\nDo you want to continue?`)) return;
                }

                filteredFiles.push(file);
            });

            filteredFiles.forEach(file => AttachmentHandler.createPreview(file));
        });

        fileInput.click();
    }

    static formatSize(bytes) {
        if (!bytes) return "0 bytes";
        const i = Math.floor(Math.log(bytes) / Math.log(1024)), units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB", "RB", "QB"];

        if (i >= units.length) return "Infinity";
        if (bytes === 0) return "0 bytes";
        if (bytes === 1) return "1 byte";

        return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${units[i]}`;
    }

    static isRenderable(type) {
        const safeTypes = [
            "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
            "video/mp4", "video/webm",
            "audio/mpeg", "audio/wav", "audio/ogg",
            "text/plain", "text/markdown", "text/csv"
        ];

        if (safeTypes.includes(type)) {
            return true;
        }

        return false;
    }

    static getType(mimeType, name) {
        let returnType;
        for (const [_, type] of Object.entries(fileTypes)) {
            // extensions have higher priority
            if (type.extensions.length > 0) {
                if (type.extensions.some(ext => name.toLowerCase().endsWith(ext.toLowerCase()))) {
                    returnType = type;
                }
            }

            // if no extensions, check mimetypes
            if (type.mimeTypes.length > 0) {
                for (const mime of type.mimeTypes) {
                    if (mime.endsWith("/*")) {
                        if (mimeType.startsWith(mime.slice(0, -2))) {
                            returnType = type;
                        }
                    } else {
                        if (mimeType === mime) {
                            returnType = type;
                        }
                    }
                }
            }
        }

        return returnType;
    }

    static getRenderMode(mimeType, name) {
        const type = AttachmentHandler.getType(mimeType, name);

        if (type) {
            return type.renderMode;
        }

        return "generic";
    }

    static getFileIcon(mimeType, name) {
        const type = AttachmentHandler.getType(mimeType, name);

        if (type) {
            return `./assets/svg/file/icon-file-${type.icon}.svg`;
        }

        return `./assets/svg/file/icon-file-unknown.svg`;
    }
}

// Get media player html
function generatePlayerHTML(attachment, mode) {
    const mediaTag = `<${mode} src="${attachment.content}" preload="metadata"></${mode}>`;
    const mediaClass = mode === "video" ? "media-video" : "media-audio";

    return `
        <div class="attachment ${mediaClass}">
            ${mode === "audio" ? `
                <img class="file-icon" src="${AttachmentHandler.getFileIcon(attachment.type, attachment.name)}">
                <div class="file-details">
                    <div class="file-info">
                        <a href="${attachment.content}" class="link" target="_blank">${attachment.name}</a>
                        <span class="file-size">${AttachmentHandler.formatSize(attachment.size)}</span>
                    </div>
                </div>` : ""}
            ${mediaTag}
            <div class="media-player-container needs-setup" id="player-${attachment.id}">
                <div class="audio-controls">
                    <button class="audio-btn audio-btn-main">
                        <svg class="icon-play" width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        <svg class="icon-pause hidden" width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        <svg class="icon-reload hidden" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
                    </button>
                    <div class="audio-time">
                        <span class="audio-current-time">-:--</span>
                        <span class="audio-time-separator">/</span>
                        <span class="audio-full-time">-:--</span>
                    </div>
                    <div class="audio-track-progress">
                        <div class="bar-main"></div>
                        <div class="bar-fetched"></div>
                        <div class="bar-hovering"></div>
                        <div class="bar-progress"></div>
                        <div class="bar-thumb"></div>
                        <div class="bar-tooltip">0:00</div>
                    </div>
                    <div class="audio-volume-wrapper">
                        <div class="audio-volume-popout">
                            <div class="audio-track-volume">
                                <div class="audio-volfill"></div>
                                <div class="audio-volthumb"></div>
                            </div>
                        </div>
                        <button class="audio-btn audio-btn-volume">
                            <svg class="vol-high" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                            <svg class="vol-low hidden" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                            <svg class="vol-mute hidden" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                        </button>
                        ${mode === "video"
                            ? `<button class="audio-btn audio-btn-fullscreen">
                                    <svg class="enter-fullscreen" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                                    <svg class="exit-fullscreen hidden" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
                               </button>`
                        : ""}
                    </div>
                </div>
            </div>

            <a href="${attachment.content}" download="${attachment.name}" style="display: none;"></a>
        </div>`;
}

// Helper function to activate all media players and handle logic for them
function setupMediaPlayers() {
    document.querySelectorAll(".media-player-container.needs-setup").forEach(container => {
        const state = {
            volume: 1,
            isSeeking: false,
            isDraggingVolume: false
        };

        const q = (s) => container.querySelector(s);

        const media = container.parentElement.querySelector("audio, video");
        if (!media) return;

        const elm = {
            audio: media,
            mainBtn: q(".audio-btn-main"),
            fullScreenBtn: media.localName === "video" ? q(".audio-btn-fullscreen") : null,
            volBtn: q(".audio-btn-volume"),

            currentTime: q(".audio-current-time"),
            totalTime: q(".audio-full-time"),

            bar: q(".audio-track-progress"),
            barFill: q(".bar-progress"),
            barBuffer: q(".bar-fetched"),
            barPreview: q(".bar-hovering"),
            barThumb: q(".bar-thumb"),
            barTooltip: q(".bar-tooltip"),

            volTrack: q(".audio-track-volume"),
            volFill: q(".audio-volfill"),
            thumbVol: q(".audio-volthumb"),
            volPopout: q(".audio-volume-popout"),

            icons: {
                highVolume: q(".vol-high"),
                lowVolume: q(".vol-low"),
                mute: q(".vol-mute"),

                play: q(".icon-play"),
                pause: q(".icon-pause"),
                reload: q(".icon-reload"),

                fsEnter: q(".enter-fullscreen"),
                fsExit: q(".exit-fullscreen")
            }
        };

        function togglePlay() {
            if (elm.audio.paused || elm.audio.ended) {
                if (elm.audio.ended) {
                    elm.audio.currentTime = 0;
                }

                elm.audio.play();
                updatePlayIcons("pause");
            } else {
                elm.audio.pause();
                updatePlayIcons("play");
            }
        }

        function updatePlayIcons(state) {
            elm.icons.play.classList.add("hidden");
            elm.icons.pause.classList.add("hidden");
            elm.icons.reload.classList.add("hidden");

            if (state === "play") {
                elm.icons.play.classList.remove("hidden");
            } else if (state === "pause") {
                elm.icons.pause.classList.remove("hidden");
            } else if (state === "reload") {
                elm.icons.reload.classList.remove("hidden");
            }
        }

        function updateVolume(value) {
            elm.audio.volume = value;
            elm.volFill.style.height = (value * 100) + "%";
            elm.thumbVol.style.bottom = (value * 100) + "%";
            elm.icons.highVolume.classList.add("hidden");
            elm.icons.lowVolume.classList.add("hidden");
            elm.icons.mute.classList.add("hidden");

            if (value === 0) {
                elm.icons.mute.classList.remove("hidden");
            } else if (value <= 0.5) {
                elm.icons.lowVolume.classList.remove("hidden");
            } else {
                elm.icons.highVolume.classList.remove("hidden");
            }
        }

        function formatTime(rawSeconds) {
            if (isNaN(rawSeconds)) return "0:00";

            const mins = Math.floor(rawSeconds / 60);
            const secs = Math.floor(rawSeconds % 60);

            return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
        }

        function handleMove(event) {
            const rect = elm.bar.getBoundingClientRect();
            const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
            const duration = elm.audio.duration || 0;
            const newTime = ratio * duration;

            elm.barFill.style.width = elm.barThumb.style.left = (ratio * 100) + "%";
            elm.currentTime.innerText = formatTime(newTime);
            elm.audio.currentTime = newTime;

            if (newTime < duration) {
                updatePlayIcons("play");
            } else {
                updatePlayIcons("reload");
            }
        }

        function handleVolume(event) {
            const rect = elm.volTrack.getBoundingClientRect();
            const val = Math.max(0, Math.min(1, 1 - ((event.clientY - rect.top) / rect.height)));
            updateVolume(val);
            if (val > 0) state.volume = val;
        };

        const duration = elm.audio.duration;
        if (!isNaN(duration) && duration > 0) {
            elm.totalTime.innerText = formatTime(duration);
            elm.currentTime.innerText = "0:00";
        }

        if (elm.fullScreenBtn) {
            elm.fullScreenBtn.onclick = () => {
                const wrapper = container.parentElement;

                if (!document.fullscreenElement) {
                    wrapper.requestFullscreen();
                    elm.icons.fsEnter.classList.add("hidden");
                    elm.icons.fsExit.classList.remove("hidden");
                } else {
                    document.exitFullscreen();
                    elm.icons.fsEnter.classList.remove("hidden");
                    elm.icons.fsExit.classList.add("hidden");
                }
            };

            document.onfullscreenchange = () => {
                if (!document.fullscreenElement) {
                    elm.icons.fsEnter.classList.remove("hidden");
                    elm.icons.fsExit.classList.add("hidden");
                }
            };
        }

        elm.mainBtn.onclick = () => togglePlay();

        elm.audio.onloadedmetadata = () => {
            elm.totalTime.innerText = formatTime(elm.audio.duration);
            elm.currentTime.innerText = "0:00";
        };

        elm.audio.onclick = () => togglePlay();

        elm.audio.ontimeupdate = () => {
            if (state.isSeeking) return;
            
            const ratio = (elm.audio.currentTime / elm.audio.duration) * 100 || 0;
            elm.barFill.style.width = elm.barThumb.style.left = ratio + "%";
            elm.currentTime.innerText = formatTime(elm.audio.currentTime);

            if (elm.audio.currentTime < elm.audio.duration) {
                updatePlayIcons(elm.audio.paused ? "play" : "pause");
            } else {
                updatePlayIcons("reload");
            }

            if (elm.audio.buffered.length > 0) {
                const bufferEnd = elm.audio.buffered.end(elm.audio.buffered.length - 1);
                elm.barBuffer.style.width = (bufferEnd / elm.audio.duration) * 100 + "%";
            }
        };

        elm.audio.onended = () => {
            updatePlayIcons("reload");
        };

        elm.bar.onmousemove = (event) => {
            const rect = elm.bar.getBoundingClientRect();
            const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
            const hoverPct = (x / rect.width) * 100;
            const currPct = (elm.audio.currentTime / elm.audio.duration) * 100;

            elm.barTooltip.style.left = x + "px";
            elm.barTooltip.innerText = formatTime((hoverPct / 100) * elm.audio.duration);
            if (hoverPct > currPct) {
                elm.barPreview.style.left = currPct + "%";
                elm.barPreview.style.width = (hoverPct - currPct) + "%";
            } else {
                elm.barPreview.style.width = "0%";
            }
        };
        elm.bar.onmouseleave = () => elm.barPreview.style.width = "0%";

        elm.bar.onmousedown = (event) => {
            event.preventDefault();
            state.isSeeking = true;
            handleMove(event);

            window.addEventListener("mousemove", handleMove);
            window.addEventListener("mouseup", () => {
                state.isSeeking = false;
                window.removeEventListener("mousemove", handleMove);
            }, { once: true });
        };

        container.onmousemove = (event) => {
            const isOverVolumeZone = elm.volBtn.contains(event.target) || elm.volPopout.contains(event.target);

            if (isOverVolumeZone || state.isDraggingVolume) {
                elm.volPopout.classList.add("show");
            } else {
                const btnRect = elm.volBtn.getBoundingClientRect();
                const popRect = elm.volPopout.getBoundingClientRect();
                const m = 15;

                const inTargetZone = (
                    event.clientX >= Math.min(btnRect.left, popRect.left) - m &&
                    event.clientX <= Math.max(btnRect.right, popRect.right) + m &&
                    event.clientY >= popRect.top - m &&
                    event.clientY <= btnRect.bottom + m
                );

                if (!inTargetZone && !state.isDraggingVolume) {
                    elm.volPopout.classList.remove("show");
                }
            }
        };

        container.onmouseleave = () => {
            if (!state.isDraggingVolume) {
                elm.volPopout.classList.remove("show");
            }
        };

        elm.volTrack.onmousedown = (event) => {
            event.preventDefault();
            state.isDraggingVolume = true;

            handleVolume(event);

            window.addEventListener("mousemove", handleVolume);
            window.addEventListener("mouseup", () => {
                state.isDraggingVolume = false;
                window.removeEventListener("mousemove", handleVolume);
            }, { once: true });
        };

        elm.volBtn.onclick = () => {
            updateVolume(elm.audio.volume > 0 ? 0 : state.volume);
        };

        container.classList.remove("needs-setup");
    });
}
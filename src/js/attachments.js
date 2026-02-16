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
            data: { id: `attach-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, file: file, name: file.name, type: file.type, size: file.size }
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
            const attachment = currentAttachments.find(a =>a.id === attachment.id);
            
            if (attachment) {
                attachment.name = nameInput.value;
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
            "application/pdf"
        ];

        if (safeTypes.includes(type)) {
            return true;
        }

        if (type.startsWith("text/")) {
            return ["plain", "markdown", "csv"].includes(type.split("/")[1]);
        }

        return false;
    }

    static getFileIcon(mimeType, name) {
        for (const [_, type] of Object.entries(fileTypes)) {
            // extensions has higher priority
            if (type.extensions.length > 0) {
                if (type.extensions.some(ext => name.toLowerCase().endsWith(ext))) {
                    console.log(`got type: ${type.icon}.svg`);
                    return `./assets/svg/file/icon-file-${type.icon}.svg`;
                }
            }

            // if no extensions, check mimetypes
            if (type.mimeTypes.length > 0) {
                for (const mime of type.mimeTypes) {
                    if (mime.endsWith("/*")) {
                        if (mimeType.startsWith(mime.slice(0, -2))) {
                            console.log(`got type: ${type.icon}.svg`);
                            return `./assets/svg/file/icon-file-${type.icon}.svg`;
                        }
                    } else {
                        if (mimeType === mime) {
                            console.log(`got type: ${type.icon}.svg`);
                            return `./assets/svg/file/icon-file-${type.icon}.svg`;
                        }
                    }
                }
            }
        }
        
        return `./assets/svg/file/icon-file-unknown.svg`;
    }
}
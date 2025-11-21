function createAttachmentPreview(file) {
    const attachmentId = `attach-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const attachmentDiv = document.createElement("div");
    attachmentDiv.className = "attachment-wrapper";
    attachmentDiv.dataset.attachId = attachmentId;
    const attachmentData = { id: attachmentId, file: file, name: file.name, type: file.type, size: file.size };
    currentAttachments.push(attachmentData);
    const isImage = file.type.startsWith("image/"), isVideo = file.type.startsWith("video/"); 
    const nameInput = document.createElement("input"); nameInput.type = "text"; nameInput.value = file.name; nameInput.className = "attachment-name";
    const removeBtn = document.createElement("button"); removeBtn.className = "remove-attachment"; removeBtn.innerHTML = "<img src='./assets/svg/ctx/Delete.svg'>";
    attachmentDiv.appendChild(removeBtn);
    if (isImage) {
        attachmentDiv.classList.add("media");
        const preview = document.createElement("img"); preview.src = URL.createObjectURL(file);
        attachmentDiv.appendChild(preview);
    } else if (isVideo) {
        attachmentDiv.classList.add("media-video");
        const preview = document.createElement("video"); preview.src = URL.createObjectURL(file);
        attachmentDiv.appendChild(preview);
    } else {
        attachmentDiv.classList.add("file-other");
        const icon = document.createElement("img"); icon.src = getFileIcon(file.type); icon.className = "file-icon"; attachmentDiv.appendChild(icon);
    }
    removeBtn.addEventListener("click", () => { 
        currentAttachments = currentAttachments.filter(a => a.id !== attachmentId); attachmentDiv.remove();
        updateSendButtonColor({ attachments: currentAttachments });
    });
    nameInput.addEventListener("change", () => { const attachment = currentAttachments.find(a =>a.id === attachmentId); if (attachment) attachment.name = nameInput.value; });
    attachmentDiv.appendChild(nameInput);
    $("message-input").appendChild(attachmentDiv);
    updateSendButtonColor({ attachments: currentAttachments });
}
function handleFileAttachment() {
    const fileInput = document.createElement("input"); fileInput.type = "file"; fileInput.multiple = true; fileInput.style.display = "none", lastDir = localStorage.getItem("lastAttachmentDirectory");
    if (lastDir) { try { fileInput.webkitdirectory = lastDir; } catch (e) { console.warn("Could not set initial directory"); } }
    fileInput.addEventListener("change", (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        try { const dirPath = files[0].path.substring(0, files[0].path.lastIndexOf("\\")); localStorage.setItem("lastAttachmentDirectory", dirPath);}catch(e){};
        let filteredFiles = [];
        files.forEach(file => {
            const fileSizeMB = file.size / (1024 * 1024);
            let warning = "";
            if (fileSizeMB > 50) warning = `Your ${file.name} (${formatFileSize(file.size)}) is over 50MB! This could freeze or crash your browser.`;
            else if (fileSizeMB > 25) warning = `Your ${file.name} (${formatFileSize(file.size)}) is over 25MB. Expect significant performance drops.`;
            else if (fileSizeMB > 10) warning = `Your ${file.name} (${formatFileSize(file.size)}) is over 10MB. Some lag may occur.`;
            if (warning) { if (!confirm(`${warning}\n\nDo you want to continue?`)) return; }
            filteredFiles.push(file);
        });
        filteredFiles.forEach(file => createAttachmentPreview(file));
    });
    fileInput.click();
}
function formatFileSize(bytes) {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = bytes, unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) { size /= 1024; unitIndex++; }
    return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
}
function canBrowserRender(mimeType) {
    const safeTypes = [
        "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
        "video/mp4", "video/webm",
        "audio/mpeg", "audio/wav", "audio/ogg",
        "application/pdf"
    ];
    if (safeTypes.includes(mimeType)) return true;
    if (mimeType.startsWith("text/")) {
        const safeTextTypes = ["plain", "markdown", "csv"], subtype = mimeType.split("/")[1];
        return safeTextTypes.includes(subtype);
    }
    return false;
}
function getFileIcon(mimeType) {
    const iconMap = {
        // Text files
        "text/": "./assets/svg/file/Text.svg",
        "text/html": "./assets/svg/file/HTML.svg",
        "text/csv": "./assets/svg/file/Spreadsheet.svg",
        // Code files
        "application/json": "./assets/svg/file/JSON.svg",
        "text/ruby": "./assets/svg/file/RubyCode.svg",
        // Media files
        "image/": "./assets/svg/file/Image.svg",
        "video/": "./assets/svg/file/Video.svg",
        "audio/": "./assets/svg/file/Audio.svg",
        // Adobe files
        "application/pdf": "./assets/svg/file/ADOBE_Acrobat.svg",
        "application/x-photoshop": "./assets/svg/file/ADOBE_Photoshop.svg",
        "application/illustrator": "./assets/svg/file/ADOBE_Illustrator.svg",
        "application/x-aftereffects": "./assets/svg/file/ADOBE_AfterEffects.svg",
        // Archive files
        "application/zip": "./assets/svg/file/Archive.svg",
        "application/x-zip-compressed": "./assets/svg/file/Archive.svg",
        "application/x-rar-compressed": "./assets/svg/file/Archive.svg",
        "application/x-7z-compressed": "./assets/svg/file/Archive.svg",
        "application/x-tar": "./assets/svg/file/Archive.svg",
        // Spreadsheets
        "application/vnd.ms-excel": "./assets/svg/file/Spreadsheet.svg",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "./assets/svg/file/Spreadsheet.svg"
    };
    if (iconMap[mimeType]) return iconMap[mimeType];
    const matchingType = Object.keys(iconMap).find(type =>  type.endsWith("/") && mimeType.startsWith(type) );
    return matchingType ? iconMap[matchingType] : "./assets/svg/file/Unknown.svg";
}
class SparkleHook {
    static core = {
        async base64ToURL(base64Data) {
            const [, mimeType = 'image/png'] = base64Data.split(',')[0].match(/data:(.*?);base64/) || [];
            const ext = mimeType.split('/')[1] || 'png';
            const formData = new FormData();
            formData.append('file', await (await fetch(base64Data)).blob(), `upload.${ext}`);
            const { data } = await (await fetch('https://tmpfiles.org/api/v1/upload', { method: 'POST', body: formData })).json();
            return data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
        },
        async resolveURL(url) {
            if (url?.startsWith("data:image")) {
                try { return await SparkleHook.core.base64ToURL(url); }
                catch (err) { console.error("Base64 upload failed:", err); return undefined; }
            } else if (url?.startsWith("./assets/")) {
                return url.replace("./assets/", "https://sparklecord.github.io/SparkleCord-Client/src/assets/");
            }
            return url;
        },
    }
    static logic = {
        async handleMessageSend({ messageData, webhookURL }) {
            let avatarUrl = await SparkleHook.core.resolveURL(messageData.avatar);
            const attachments = await Promise.all((messageData.attachments || []).map(async a => {
                if (a.content.startsWith("data:image")) {
                    const blob = await fetch(a.content).then(r => r.blob());
                    return { blob, filename: a.name };
                }
                const fileUrl = await SparkleHook.core.resolveURL(a.content);
                const response = await fetch(fileUrl);
                const blob = await response.blob();
                return { blob, filename: a.name };
            }));

            const payload = {
                username: messageData.name,
                ...(avatarUrl && { avatar_url: avatarUrl }),
                content: messageData.content,
            };

            const formData = new FormData();
            if (attachments.length > 0) {
                payload.attachments = attachments.map((a, i) => ({
                    id: i,
                    filename: a.filename
                }));
                for (let i = 0; i < attachments.length; i++) {
                    const { blob, filename } = attachments[i];
                    formData.append(`files[${i}]`, blob, filename);
                }
            }

            formData.append("payload_json", JSON.stringify(payload));

            return fetch(webhookURL, {
                method: "POST",
                body: formData,
            }).then(response => {
                if (!response.ok) return response.text().then(t => Promise.reject(t));
                return response.status === 204 ? "OK (no content)" : response.json();
            });
        },

        async handleSystemMessage({ messageData, runData, webhookURL }) {
            let avatarUrl = await SparkleHook.core.resolveURL(messageData.avatar);
            const embeds = await Promise.all((runData.embeds || []).map(async embed => {
                const newEmbed = structuredClone(embed);
                if (newEmbed?.author?.icon) newEmbed.author.icon_url = await SparkleHook.core.resolveURL(newEmbed.author.icon);
                if (newEmbed?.footer?.icon) newEmbed.footer.icon_url = await SparkleHook.core.resolveURL(newEmbed.footer.icon);
                return newEmbed;
            }));

            const payload = {
                username: messageData.name,
                ...(avatarUrl && { avatar_url: avatarUrl }),
                content: `${messageData.content}${runData.ephemeral ? "\n-# <:eye:1261348813625495563> This message is ephemeral inside of SparkleCord." : ''}`,
                embeds
            };

            return fetch(webhookURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        }
    }
}
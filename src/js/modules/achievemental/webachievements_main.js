class Storage {
    constructor(dbName = "localStorage", storeName = "localStore") {
        this.s = storeName;
        this.db = null;
        this.init(dbName);
    }

    init(name) {
        const request = indexedDB.open(name, 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(this.s)) {
                db.createObjectStore(this.s);
            }
        }
        request.onsuccess = (e) => this.db = e.target.result;
        request.onerror = (e) => console.error(e);
    }

    set(key, value) {
        const tx = this.db.transaction(this.s, "readwrite");
        tx.objectStore(this.s).put(value, key);
        tx.onerror = (e) => console.error(e);
    }

    async get(key) {
        if (!this.db) await new Promise((rs, rj) => { const i = setInterval(() => { if (this.db) { clearInterval(i); rs(); } }, 100); });
        return await new Promise((rs, rj) => {
            const request = this.db.transaction(this.s, "readonly").objectStore(this.s).get(key);
            request.onsuccess = () => rs(request.result);
            request.onerror = (e) => rj(e);
        });
    }

    remove(key) {
        const tx = this.db.transaction(this.s, "readwrite");
        tx.objectStore(this.s).delete(key);
        tx.onerror = (e) => console.error(e);
    }
}

class Achievements {
    constructor(site) {
        this.storage = new Storage(`WebAchievements-database_${site}`, `WebAchievements-store_${site}`);
        this.achievements = {};
        this.defaultPreset = "minecraft_challenge";
    }

    async init() {
        const achievements = await this.storage.get("achievementsList");

        if (achievements) {
            Object.entries(achievements).forEach(([internalId, opts]) => {
                this.achievements[internalId] = new Achievement(opts);
            });
        }
    }

    addAchievement(opts) {
        if (this.achievements[opts.internalId]) return;

        const ach = new Achievement(opts);
        this.achievements[opts.internalId] = ach;
        this.storage.set("achievementsList", this.achievements);
        return this.achievements[opts.internalId];
    }

    addAchievements(opts) {
        Object.entries(opts).forEach(([internalId, optionsObject]) => {
            if (this.achievements[internalId]) return;
            if (!optionsObject.internalId) optionsObject.internalId = internalId;

            const ach = new Achievement(optionsObject);
            this.achievements[optionsObject.internalId ?? internalId] = ach;
        });
        this.storage.set("achievementsList", this.achievements);
        return this.achievements;
    }

    getAchievementById(id) {
        if (typeof id === "string") {
            return Object.values(this.achievements).find(ach => ach.internalId === id) || this.achievements[id];
        } else if (typeof id === "number") {
            return Object.values(this.achievements).find(ach => ach.id === id);
        }

        return null;
    }

    has(id) {
        const achievement = this.getAchievementById(id);
        if (achievement === null) return;

        return achievement.unlocked;
    }

    test(id) {
        const achievement = this.getAchievementById(id);
        if (achievement === null) return;

        if (achievement.currentProgress === achievement.progressMax || achievement.unlocked) {
            return true;
        }

        return false;
    }

    incrementProgress(id, amount) {
        const achievement = this.getAchievementById(id);
        if (achievement === null) return;

        if (achievement.currentProgress < achievement.progressMax) {
            achievement.currentProgress += amount;
        }

        this.storage.set("achievementsList", this.achievements);

        return amount;
    }

    setProgress(id, value) {
        const achievement = this.getAchievementById(id);
        if (achievement === null) return;

        if (achievement.currentProgress < achievement.progressMax) {
            achievement.currentProgress = value;
        }

        this.storage.set("achievementsList", this.achievements);

        return value;
    }

    getCompletion() {
        const total = Object.values(this.achievements).length;
        const unlocked = Object.values(this.achievements).filter(ach => ach.unlocked === true).length;

        return { total, unlocked, unlockedPercent: (unlocked / total) * 100 };
    }

    unlock(id) {
        const achievement = this.getAchievementById(id);
        if (achievement === null) return;

        const unlockEvent = new CustomEvent("achievementUnlock", {
            detail: { achievement }
        });

        achievement.unlocked = true;
        achievement.hidden = false;
        achievement.unlockedAt = (Date.now() / 1000 | 0); // get milliseconds, divide by 1000 and floor to remove decimals, getting us the amount of seconds since 1970.

        this.storage.set("achievementsList", this.achievements);

        document.dispatchEvent(unlockEvent);
    }
}

class Achievement {
    constructor(options) {
        this.defaultSettings = {
            displayName: "Unknown Achievement",
            description: "No options provided. Please provide options.",
            visualStyle: "generic",
            icon: "UNKNOWN_ACHIEVEMENT_ICON",

            internalId: "",
            id: "",

            progressMax: 100,
            currentProgress: 0,
            unlocked: false,
            hidden: false,
            difficulty: "easy",
            unlockedAt: null
        }

        this.options = {
            visualStyles: ["xboxone_normal", "xboxone_rare", "minecraft_task", "minecraft_goal", "minecraft_challenge", "discord_party", "discord_notification", "generic", "custom"],
            difficulties: ["simple", "easy", "medium", "hard", "difficult", "extreme", "godlike"],

            validKeys: ["displayName", "description", "visualStyle", "icon", "internalId", "id", "progressMax", "currentProgress", "unlocked", "hidden", "difficulty", "unlockedAt"]
        };

        this.options.validKeys.forEach(key => {
            if (options[key] !== undefined) {
                this[key] = options[key];
            } else {
                this[key] = this.defaultSettings[key];
            }
        });
    }
}
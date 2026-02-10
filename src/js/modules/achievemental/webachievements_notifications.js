class AchievementNotificationPreset {
    static directions = ["top right", "top middle", "top left", "bottom right", "bottom middle", "bottom left"];

    constructor(name, options) {
        this.presetName = name;
        this.options = options;

        if (!document.getElementById(`style-${this.name}`)) {
            document.head.appendChild(el("style", { id: `achievemental-preset-${this.presetName}`, textContent: this.options.css }));
        }
    }

    show(id) {
        const achievement = (id instanceof Achievement) ? id : Achievements.getAchievementById(id);
        
    }
}

// internal preset to avoid breaking the Don't Repeat Yourself (DRY) rule
const preset_minecraft = new AchievementNotificationPreset("minecraft", {
    sound: "./modules/achievemental/notif/sound/",
    direction: "top right",
    frameClass: "minecraft",

    colors: {
        text_challenge: "#F985F9",
        text_task: "#F2F201",
        text_regular: "#FAFAFA",
    },

    text: {
        task_old: "Achievement Get!",
        task: "Advancement Made!",
        goal: "Goal Reached!",
        challenge: "Challenge Complete!"
    },

    html: `
        <div class="frame minecraft">
            <img class="icon" src="{{achievement.icon}}"/>
            <div class="container">
                <span class="title">${this.text.task_old}</span>
                <p class="description">{{achievement.displayName}}</p>
            </div>
        </div>
    `,

    css: `
        .frame.minecraft {
            --text-regular: ${this.colors.text_regular};
            --title-color: ${this.colors.text_task};

            --background-image: url("./achievemental/notif/background/minecraft.png");
            --font-path: "Minecraft";
        }

        .frame.minecraft {
            background-color: transparent;
            background-image: var(--background-image);
            background-size: 100% 100%;
            background-repeat: no-repeat;

            transform-origin: top right;
            width: 160px;
            height: 32px;
            scale: 220%;
            margin: 10px;

            display: flex;
            position: fixed;
            top: 0;
            right: 0;

            font-family: var(--font-path);
        }

        .frame.minecraft .icon {
            position: absolute;
            left: 8px;
            top: 8px;
            width: 16px;
            height: 16px;
        }

        .frame.minecraft .container {
            position: absolute;
            left: 32px;
            top: 7px;
            display: flex;
            flex-direction: column;
        }

        .frame.minecraft .title {
            color: var(--title-color);
            font-size: 9px;
            line-height: 1;
        }

        .frame.minecraft .description {
            color: var(--text-regular);
            font-size: 9px;
            line-height: 1;
            margin-top: 1px;
        }
    `
});

const presets = {
    minecraft_task: new AchievementNotificationPreset("minecraft_task", {
        sound: "./modules/achievemental/notif/sound/",
        direction: "top right",
        frameClass: "minecraft",
    }),

    colors: preset_minecraft.colors,
    text: preset_minecraft.text,

    
};
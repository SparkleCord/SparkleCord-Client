const EASTER_EGGS_ENABLED_DEVELOPMENT = true;
if (EASTER_EGGS_ENABLED_DEVELOPMENT) {
    const SPARKLECORD_CONSOLE_COMMANDS = [
        {
            name: "birthday",
            help: "none",
            get() {
                // unlock: Happy Birthday!

                console.log("Happy Birthday, SparkleCord!");
                localStorage.setItem("sparkleCake", "true"); // unlock the birthday menu
            }
        },
        {
            name: "love",
            help: "none",
            get() {
                // unlock: I love you too
            }
        },
        {
            name: "cake",
            help: "none",
            get() {
                // unlock: The Cake was a Lie
            }
        },
        {
            name: "noclip",
            help: "just like the good old days",
            get() {
                // make all text editable
                // document.designMode = "on";
            }
        },
        {
            name: "lightmode",
            help: "i don't recommend this command...",
            get() {
                // unlock: Blindness IV
                // flash the user's screen white
            }
        },
        {
            name: "darkmode",
            help: "the lights have shut off",
            get() {
                // make everything black
            }
        },
        {
            name: "help",
            help: "shows this message",
            get() {
                console.log(SPARKLECORD_CONSOLE_COMMANDS.map(command => `${command.name} - ${command.help}\n`));
            }
        },
        {
            name: "the2048",
            help: "you hopefully know this game",
            get() {
                // unlock: The Coolest Block Game
                // starts a mini 2048
            }
        },
        {
            name: "doctoon",
            help: "i made sparklecord",
            get() {
                // unlock: Hello Everybody, it's me.
            }
        }
    ];

    SPARKLECORD_CONSOLE_COMMANDS.forEach(cmd => {
        if (!window[cmd.name]) Object.defineProperty(window, cmd.name, { get: cmd.get, configurable: true });
    });
}
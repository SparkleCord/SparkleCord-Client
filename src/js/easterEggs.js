const EASTER_EGGS_ENABLED_DEVELOPMENT = true;
if (EASTER_EGGS_ENABLED_DEVELOPMENT) {
    const SPARKLECORD_CONSOLE_COMMANDS = [
        {
            name: "birthday",
            help: "shows when sparklecord was born",
            get() {
                console.log("SparkleCord was born on February 29th, 2024.");
            }
        },
        {
            name: "noclip",
            help: "just like the good old days",
            get() {
                // make all text editable
                document.designMode = "on";
            }
        },
        {
            name: "lightmode",
            help: "i don't recommend this command...",
            get() {
                // flash the user's screen white
                const f = $("#fullscreendisplay");
                f.style.backgroundColor = "white";
                f.classList.add("active");

                // hide after 3 secs
                setTimeout(() => {
                    f.classList.remove("active");
                }, 3000);
            }
        },
        {
            name: "darkmode",
            help: "the lights have shut off",
            get() {
                // flash the user's screen black (yes this is just a copy of the other one but black)
                const f = $("#fullscreendisplay");
                f.style.backgroundColor = "black";
                f.classList.add("active");

                // hide after 3 secs
                setTimeout(() => {
                    f.classList.remove("active");
                }, 3000);
            }
        },
        {
            name: "help",
            help: "shows this message",
            get() {
                console.log(SPARKLECORD_CONSOLE_COMMANDS.map(command => `${command.name} - ${command.help}\n`));
            }
        }
    ];

    SPARKLECORD_CONSOLE_COMMANDS.forEach(cmd => {
        if (!window[cmd.name]) Object.defineProperty(window, cmd.name, { get: cmd.get, configurable: true });
    });
}
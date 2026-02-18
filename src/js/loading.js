const rootPath = (() => {
    const path = window.location.href;
    if (window.location.protocol === 'file:') { return path.substring(0, path.lastIndexOf('/') + 1); }
    return window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
})();

const LOADING_LINES = [
    /* All lines were written by doctoon unless stated otherwise */
    // SparkleCord OLD lines
    { text: "Self-Love has never been easier!", weight: 1 },
    { text: "You can customize your profile!", weight: 1 },
    { text: "SparkleCord keeps you connected.... with yourself...", weight: 1 },
    { text: "Enjoy chatting with ~~friends~~ yourself!", weight: 1 },
    // Modified Discord lines
    // if u want the original lines, check out https://gist.github.com/fourjr/f94fc112cef6da07fc274216d5755420
    { text: "SparkleCord was almost called SparkAccord when I was looking for better names. Not too proud of that one.", weight: 1 },
    { text: 'There are a bunch of hidden "Easter Eggs" in the app that happen when you click certain things...', weight: 1 },
    { text: "SparkleCord started off as just a silly project that barely looked or acted like Discord.", weight: 1 },
    { text: "SparkleCord's official birthday is February 29th, 2024.", weight: 1 },
    // Keybinds
    { text: "[[SHIFT]] + [[ENTER]] to make a new line without sending your message.", weight: 1 },
    { text: `You can press [[${arrowUpHook}]] to quickly edit your most recent message.`, weight: 1 },
    // Tips
    { text: "You can drag and drop files onto SparkleCord to upload them.", weight: 1 },
    { text: "\\Do **this** for bold, *this* for italic, and the rest? idk i'll get them later.\\", weight: 1 },
    { text: "Customize SparkleCord's appearance in the user settings menu.", weight: 1 },
    { text: "You can right click a message to Edit, [Delete]{var(--status-danger)}, And more!", weight: 1 },
    // Custom SparkleCord lines
    { text: "There was an error loading SparkleCord, have a 🗣🔥 instead :D", weight: 1 },
    { text: "Loading the loading line, Please wait... ↻", weight: 1 },
    { text: "Messages aren't stored anywhere!", weight: 1 },
    { text: "hello bob...", weight: 1 },
    { text: "99% of people are chronically on Discord. Be happy you're the 1% using SparkleCord.", weight: 1, author: "gdtapioka" },
    { text: "too lazy to add a loading screen message, check back later.", weight: 1, author: "gdtapioka" },
    { text: "There was a time where SparkleCord would've still been JSONCord...", weight: 1 },
    { text: "doctoon was here", weight: 1 },
    { text: "Big Berry saved our logo from being just a white sparkle emoji.", weight: 1 },
    { text: "SparkleCord was created on a Thursday at 11:43:41 PM GMT+2.", weight: 1 },
    { text: "SparkleCord will always be a web-based app. (maybe)", weight: 1 },
    // Time-specific lines
    { text: "I used SparkleCord at 3 AM (Gone Wrong) (Police Called) 😱😱😱", condition: () => getUTCDate().getHours() === 3, weight: 10 },
    // Holiday-specific lines
    { text: "Merry Halloween! I hope you got your easter eggs... wait... did I say that right?", holiday: "HALLOWEEN", weight: 3 },
    { text: "All I want for christmas... is meeeeeeee.....", holiday: "CHRISTMAS", weight: 3 },
     // Condition-specific lines
    { text: "SparkleCord: Nightly Edition", condition: () => { let h = getUTCDate().getHours(); return h >= 20 || h < 6; }, weight: 10 },
    { text: "You're not supposed to see this... OH SH-", condition: () => JSON.parse(localStorage.getItem("secret-setting") || "false"), weight: 10 },
    { text: `Welcome back, ${JSON.parse(localStorage.getItem("profile") || "{}").name || "User"}!`, condition: () => true, weight: 1 },
    { text: localStorage.getItem("custom-loading-line") || "", condition: () => JSON.parse(localStorage.getItem("custom-line-enabled") || "false"), weight: 50000 }
];

function getUTCDate(dateString = null) {
    if (dateString) return new Date(dateString);
    return new Date(); // For debugging, you may input a test date, such as '2025-10-31 03:00:00' inside the return statement.
};

function getHoliday(date) {
    const month = date.getUTCMonth(), day = date.getUTCDate(), holidays = {
        BIRTHDAY_DISCORD: { month: 5, start: 13, end: 20 }, // May 13th - May 20th
        BIRTHDAY: { month: 2, start: 20, end: 30 }, // February 20th - February 30th (aka march 1st)
        HALLOWEEN: { month: 10, start: 1, end: 31 }, // October 1 - October 31st
        CHRISTMAS: { month: 12, start: 1, end: 31 }, // December 1 - December 31st
    };
    for (const [name, period] of Object.entries(holidays)) { if (month === (period.month - 1) && day >= period.start && day <= period.end) { return name; } }
    return null;
};

function getSpinnerPath(holiday) {
    let spinners = {
        BIRTHDAY_DISCORD: './assets/loading/Discord.gif',
        BIRTHDAY: './assets/loading/Birthday.gif',
        HALLOWEEN: './assets/loading/Halloween.gif',
        CHRISTMAS: './assets/loading/Christmas.gif',
        DEFAULT: './assets/loading/Default.gif'
    };
    if (document.documentElement.classList.contains("theme-light")) {
        if (holiday === "BIRTHDAY_DISCORD") spinners.BIRTHDAY_DISCORD = './assets/loading/Discord-Light.gif';
        if (holiday === "CHRISTMAS") spinners.CHRISTMAS = './assets/loading/Christmas-Light.gif';
    }
    return spinners[holiday] || spinners.DEFAULT;
};

function updateSpinner() { 
    const spinner = $('#spinner');
    spinner.src = getSpinnerPath(getHoliday(getUTCDate())); 
};

function showLoadingScreen(loadingTime) {
    function getRandomLine() {
        const currentDate = getUTCDate(), currentHoliday = getHoliday(currentDate);
        const validLines = LOADING_LINES.filter(line => {
            if (!line.text) return false;
            if (line.holiday && line.holiday !== currentHoliday) return false;
            if (line.condition && !line.condition()) return false;
            return true;
        });
        if (!validLines.length) {
            console.warn("No valid lines found");
            return "Loading...";
        }
        const totalWeight = validLines.reduce((sum, line) => sum + (line.weight || 1), 0);
        let random = Math.random() * totalWeight;
        for (const line of validLines) {
            random -= (line.weight || 1);
            if (random <= 0) {
                return line.text;
            }
        }        
        return validLines[0].text;
    }
    function showLoadingLine() {
        const line = $('#loading-line'), header = $('#loading-text'), randomLine = getRandomLine();
        // const randomLine = LOADING_LINES[0]; // Force one of the existing lines based on array index.
        header.innerHTML = 'Did You Know';
        line.innerHTML = parseMarkdown(randomLine);
        line.classList.remove("loadError"); header.classList.remove("loadError"); // Remove any classes related to loading errors if showLoadingScreen successfully runs without errors beforehand.
        updateSpinner();
    }
    function hideLoadingScreen() {
        const loadingScreen = $('#loading-screen');
        loadingScreen.classList.add('hide');

        eventBus.emit("loaded", { timestamp: Date.now() });
    }
    showLoadingLine();
    setTimeout(hideLoadingScreen, loadingTime);
}

new MutationObserver(m=>m.some(x=>x.attributeName=='class'&&updateSpinner())).observe(document.documentElement,{attributes:1,attributeFilter:['class']});

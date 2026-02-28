const HLJS_ALIASES = {
    "as": "actionscript",
    "adoc": "asciidoc",
    "arm": "armasm", "avrasm": "armasm", "x86asm": "armasm",
    "sh": "bash", "zsh": "bash", "shell": "bash",
    "bf": "brainfuck",
    "h": "c",
    "cpp": "cpp", "cc": "cpp", "c++": "cpp", "h++": "cpp", "hpp": "cpp", "hh": "cpp", "hxx": "cpp", "cxx": "cpp",
    "cs": "csharp", "c#": "csharp",
    "capnp": "capnproto",
    "clj": "clojure", "cljs": "clojure", "cljc": "clojure", "edn": "clojure",
    "coffee": "coffeescript", "cson": "coffeescript", "iced": "coffeescript",
    "dockerfile": "dockerfile", "docker": "dockerfile",
    "patch": "diff",
    "django": "django", "jinja": "django",
    "ex": "elixir", "exs": "elixir",
    "erl": "erlang", "hrl": "erlang",
    "fs": "fsharp", "fsi": "fsharp", "fsx": "fsharp",
    "f90": "fortran", "f95": "fortran", "f03": "fortran", "f08": "fortran",
    "go": "go", "golang": "go",
    "gvy": "groovy", "gradle": "groovy",
    "hbs": "handlebars", "html.hbs": "handlebars", "html.handlebars": "handlebars", 
    "hs": "haskell", "lhs": "haskell",
    "hx": "haxe", "hxml": "haxe",
    "html": "html", "xhtml": "html", "htm": "html",
    "i7": "inform7",
    "java": "java", "jsp": "java",
    "js": "javascript", "jsx": "javascript", "mjs": "javascript", "cjs": "javascript", 
    "jl": "julia", "julia": "julia",
    "kt": "kotlin", "kts": "kotlin",
    "tex": "latex",
    "less": "less",
    "ls": "livescript",
    "md": "markdown", "markdown": "markdown", "mkd": "markdown", "mkdown": "markdown",
    "mathematica": "mathematica", "mma": "mathematica",
    "moon": "moonscript",
    "nginxconf": "nginx", "nginx.conf": "nginx",
    "nim": "nim",
    "mm": "objectivec", "objc": "objectivec", "obj-c": "objectivec", "m": "objectivec",
    "ml": "ocaml", "mli": "ocaml",
    "pl": "perl", "pm": "perl", "perl": "perl",
    "php": "php", "php3": "php", "php4": "php", "php5": "php", "php6": "php", "php7": "php", "php8": "php",
    "ps": "powershell", "ps1": "powershell", "psd1": "powershell", "psm1": "powershell",
    "proto": "protobuf",
    "pp": "puppet",
    "py": "python", "py3": "python", "pyc": "python", "pyw": "python",
    "r": "r",
    "re": "reasonml",
    "rb": "ruby", "rbw": "ruby", "rake": "ruby", "gemspec": "ruby", "podspec": "ruby", "thor": "ruby",
    "rs": "rust",
    "sci": "scilab", "sce": "scilab",
    "scss": "scss",
    "st": "smalltalk",
    "sml": "sml", "ml": "sml",
    "sql": "sql",
    "styl": "stylus",
    "swift": "swift",
    "ts": "typescript", "tsx": "typescript",
    "vb": "vbnet",
    "vbs": "vbscript",
    "yml": "yaml", "yaml": "yaml",
    "zep": "zephir"
};

const HLJS_JUSTLANGS = [
    "1c", "abnf", "accesslog", "actionscript", "ada", "apache", "applescript", "arcade", "arduino", "armasm", "asciidoc", "aspectj", "autohotkey", "autoit", "avrasm", "awk", "bash", "basic", "bnf", "brainfuck", "c", "cal", "capnproto", "clojure", "cmake", "coffeescript", "coq", "cos", "cpp", "crmsh", "crystal", "csharp", "css", "csv", "d", "dart", "delphi", "diff", "django", "dns", "dockerfile", "dos", "dsconfig", "dts", "dust", "ebnf", "elixir", "elm", "erlang", "excel", "fix", "fortran", "fsharp", "gams", "gauss", "gcode", "gherkin", "glsl", "go", "golo", "gradle", "groovy", "haml", "handlebars", "haskell", "haxe", "hsp", "html", "http", "hy", "inform7", "ini", "irpf90", "java", "javascript", "json", "julia", "kotlin", "lasso", "latex", "ldif", 
    "leaf", "less", "lisp", "livecodeserver", "livescript", "llvm", "lua", "makefile", "markdown", "mathematica", "matlab", "maxima", "mel", "mercury", "mipsasm", "mizar", "mojolicious", "monkey", "moonscript", "n1ql", "nginx", "nim", "nix", "nsis", "objectivec", "ocaml", "openscad", "oxygene", "parser3", "perl", "pf", "php", "pony", "powershell", "processing", "profile", "prolog", "properties", "protobuf", "puppet", "python", "q", "qml", "r", "reasonml", "rib", "roboconf", "ruby", "rust", "sas", "scala", "scheme", "scilab", "scss", "shell", "smali", "smalltalk", "sml", "sql", "stan", "stata", "step21", "stylus", "subunit", "swift", "taggerscript", "tap", "tcl", "tex", "thrift", "tp", "twig", "typescript", "vala", "vbnet", "vbscript", "verilog", "vhdl", "vim", "xml", "xquery", "yaml", "zephir"
];

const HLJS_LANGUAGES = [
    ...Object.keys(HLJS_ALIASES),
    ...HLJS_JUSTLANGS
]

async function loadHighlight(lang) {
    const cleanLang = lang.toLowerCase().trim();

    if (window.hljs?.getLanguage(cleanLang)) return;

    if (!window.hljs) {
        await loadScript("./js/modules/highlight/highlight.min.js");
        hljs.configure({ throwUnescapedHTML: true, languages: ["plaintext"] });
    }

    const normalizedLang = HLJS_ALIASES[cleanLang] || cleanLang;
    
    if (normalizedLang === "plaintext" || hljs.getLanguage(normalizedLang)) {
        return;
    }

    try {
        await loadScript(`./js/modules/highlight/languages/${normalizedLang}.min.js`);
    } catch (e) {
        // console.warn(`Failed to load language: ${normalizedLang}`, e);
        return "plaintext";
    }
}
function loadScript(src) {
    return new Promise((resolve, reject) => { 
        const script = document.createElement("script"); script.src = src; script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
    });
}

function addCopyButton(block) {
    const wrapper = block.parentElement;
    if (!wrapper || !wrapper.classList.contains("code-wrapper")) return;
    const button = document.createElement("button");
    button.className = "copy-button";
    button.innerHTML = `
        <svg class="copy-icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M3 16a1 1 0 0 1-1-1v-5a8 8 0 0 1 8-8h5a1 1 0 0 1 1 1v.5a.5.5 0 0 1-.5.5H10a6 6 0 0 0-6 6v5.5a.5.5 0 0 1-.5.5H3Z" class=""></path><path fill="currentColor" d="M6 18a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-4h-3a5 5 0 0 1-5-5V6h-4a4 4 0 0 0-4 4v8Z" class=""></path><path fill="currentColor" d="M21.73 12a3 3 0 0 0-.6-.88l-4.25-4.24a3 3 0 0 0-.88-.61V9a3 3 0 0 0 3 3h2.73Z" class=""></path></svg>
        <svg class="check-icon" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>`;
    wrapper.appendChild(button);
    button.addEventListener("click", async () => {
        const code = block.querySelector("code").textContent;
        try {
            await navigator.clipboard.writeText(code); button.classList.add("copied"); setTimeout(() => button.classList.remove("copied"), 10000);
        } catch (err) { console.error("Failed to copy:", err); }
    });
}
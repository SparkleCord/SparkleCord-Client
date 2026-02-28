// NOTE: this script is ran in the development environment using node.js, it downloads all language definition files
const fs = require("fs");
const https = require("https");
const path = require("path");

const HLJS_VERSION = "11.8.0";
const OUTPUT_DIR = path.join(__dirname);

const LANGUAGES = [
    "1c", "abnf", "accesslog", "actionscript", "ada", "apache", "applescript", "arcade", 
    "arduino", "armasm", "asciidoc", "aspectj", "autohotkey", "autoit", "avrasm", "awk",
    "bash", "basic", "bnf", "brainfuck", "c", "cal", "capnproto", "clojure", "cmake",
    "coffeescript", "coq", "cos", "cpp", "crmsh", "crystal", "csharp", "css", "csv", "d",
    "dart", "delphi", "diff", "django", "dns", "dockerfile", "dos", "dsconfig", "dts", 
    "dust", "ebnf", "elixir", "elm", "erlang", "excel", "fix", "fortran", "fsharp", 
    "gams", "gauss", "gcode", "gherkin", "glsl", "go", "golo", "gradle", "groovy", "haml",
    "handlebars", "haskell", "haxe", "hsp", "html", "http", "hy", "inform7", "ini", 
    "irpf90", "java", "javascript", "json", "julia", "kotlin", "lasso", "latex", "ldif",
    "leaf", "less", "lisp", "livecodeserver", "livescript", "llvm", "lua", "makefile",
    "markdown", "mathematica", "matlab", "maxima", "mel", "mercury", "mipsasm", "mizar",
    "mojolicious", "monkey", "moonscript", "n1ql", "nginx", "nim", "nix", "nsis",
    "objectivec", "ocaml", "openscad", "oxygene", "parser3", "perl", "pf", "php",
    "pony", "powershell", "processing", "profile", "prolog", "properties", "protobuf",
    "puppet", "python", "q", "qml", "r", "reasonml", "rib", "roboconf", "ruby", "rust",
    "sas", "scala", "scheme", "scilab", "scss", "shell", "smali", "smalltalk", "sml",
    "sql", "stan", "stata", "step21", "stylus", "subunit", "swift", "taggerscript",
    "tap", "tcl", "tex", "thrift", "tp", "twig", "typescript", "vala", "vbnet",
    "vbscript", "verilog", "vhdl", "vim", "xml", "xquery", "yaml", "zephir"
];

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const LANG_DIR = path.join(OUTPUT_DIR, "languages");
if (!fs.existsSync(LANG_DIR)) {
    fs.mkdirSync(LANG_DIR, { recursive: true });
}

https.get(`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${HLJS_VERSION}/highlight.min.js`, (res) => {
    let data = "";
    res.on("data", (chunk) => data += chunk);
    res.on("end", () => {
        fs.writeFileSync(path.join(OUTPUT_DIR, "highlight.min.js"), data);
        console.log("Downloaded highlight.js core");
        LANGUAGES.forEach(lang => {
            https.get(`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${HLJS_VERSION}/languages/${lang}.min.js`, (res) => {
                let data = "";
                res.on("data", (chunk) => data += chunk);
                res.on("end", () => {
                    fs.writeFileSync(path.join(LANG_DIR, `${lang}.min.js`), data);
                    console.log(`Downloaded ${lang}.min.js`);
                });
            }).on("error", (err) => { console.error(`Error downloading ${lang}:`, err); });
        });
    });
}).on("error", (err) => {
    console.error("Error downloading highlight.js core:", err);
});
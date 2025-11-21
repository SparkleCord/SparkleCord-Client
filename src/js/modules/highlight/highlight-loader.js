const HLJS_ALIASES = {
    'as': 'actionscript',                                                         /* ActionScript */
    'adoc': 'asciidoc',                                                          /* AsciiDoc */
    'arm': 'armasm', 'avrasm': 'armasm', 'x86asm': 'armasm',                    /* Assembly */
    'sh': 'bash', 'zsh': 'bash', 'shell': 'bash',                               /* Bash/Shell */
    'bf': 'brainfuck',                                                           /* Brainfuck */
    'h': 'c',                                                                    /* C */
    'cpp': 'cpp', 'cc': 'cpp', 'c++': 'cpp', 'h++': 'cpp', 'hpp': 'cpp', 'hh': 'cpp', 'hxx': 'cpp', 'cxx': 'cpp',/* C++ */
    'cs': 'csharp', 'c#': 'csharp',                                             /* C# */
    'capnp': 'capnproto',                                                       /* Cap'n Proto */
    'clj': 'clojure', 'cljs': 'clojure', 'cljc': 'clojure', 'edn': 'clojure',  /* Clojure */
    'coffee': 'coffeescript', 'cson': 'coffeescript', 'iced': 'coffeescript',   /* CoffeeScript */
    'dockerfile': 'dockerfile', 'docker': 'dockerfile',                          /* Dockerfile */
    'patch': 'diff',                                                            /* Diff */
    'django': 'django', 'jinja': 'django',                                      /* Django */
    'ex': 'elixir', 'exs': 'elixir',                                           /* Elixir */
    'erl': 'erlang', 'hrl': 'erlang',                                          /* Erlang */
    'fs': 'fsharp', 'fsi': 'fsharp', 'fsx': 'fsharp',                         /* F# */
    'f90': 'fortran', 'f95': 'fortran', 'f03': 'fortran', 'f08': 'fortran',   /* Fortran */
    'go': 'go', 'golang': 'go',                                               /* Go */
    'gvy': 'groovy', 'gradle': 'groovy',                                      /* Groovy */
    'hbs': 'handlebars', 'html.hbs': 'handlebars', 'html.handlebars': 'handlebars', /* Handlebars */ 
    'hs': 'haskell', 'lhs': 'haskell',                                       /* Haskell */
    'hx': 'haxe', 'hxml': 'haxe',                                           /* Haxe */
    'html': 'html', 'xhtml': 'html', 'htm': 'html',                         /* HTML */
    'i7': 'inform7',                                                        /* Inform7 */
    'java': 'java', 'jsp': 'java',                                        /* Java */
    'js': 'javascript', 'jsx': 'javascript', 'mjs': 'javascript', 'cjs': 'javascript', /* JavaScript */ 
    'jl': 'julia', 'julia': 'julia',                                     /* Julia */
    'kt': 'kotlin', 'kts': 'kotlin',                                    /* Kotlin */
    'tex': 'latex',                                                     /* LaTeX */
    'less': 'less',                                                    /* Less */
    'ls': 'livescript',                                               /* LiveScript */
    'md': 'markdown', 'markdown': 'markdown', 'mkd': 'markdown', 'mkdown': 'markdown', /* Markdown */
    'mathematica': 'mathematica', 'mma': 'mathematica',              /* Mathematica */
    'moon': 'moonscript',                                           /* Moonscript */
    'nginxconf': 'nginx', 'nginx.conf': 'nginx',                    /* Nginx */
    'nim': 'nim',                                                  /* Nim */
    'mm': 'objectivec', 'objc': 'objectivec', 'obj-c': 'objectivec', 'm': 'objectivec', /* Objective-C */
    'ml': 'ocaml', 'mli': 'ocaml',                               /* OCaml */
    'pl': 'perl', 'pm': 'perl', 'perl': 'perl',                 /* Perl */
    'php': 'php', 'php3': 'php', 'php4': 'php', 'php5': 'php', 'php6': 'php', 'php7': 'php', 'php8': 'php', /* PHP */
    'ps': 'powershell', 'ps1': 'powershell', 'psd1': 'powershell', 'psm1': 'powershell', /* PowerShell */
    'proto': 'protobuf',                                        /* Protocol Buffers */
    'pp': 'puppet',                                            /* Puppet */
    'py': 'python', 'py3': 'python', 'pyc': 'python', 'pyw': 'python', /* Python */
    'r': 'r',                                                 /* R */
    're': 'reasonml',                                        /* ReasonML */
    'rb': 'ruby', 'rbw': 'ruby', 'rake': 'ruby', 'gemspec': 'ruby', 'podspec': 'ruby', 'thor': 'ruby',/* Ruby */
    'rs': 'rust',                                          /* Rust */
    'sci': 'scilab', 'sce': 'scilab',                     /* Scilab */
    'scss': 'scss',                                       /* SCSS */
    'st': 'smalltalk',                                   /* Smalltalk */
    'sml': 'sml', 'ml': 'sml',                          /* Standard ML */
    'sql': 'sql',                                      /* SQL */
    'styl': 'stylus',                                 /* Stylus */
    'swift': 'swift',                               /* Swift */
    'ts': 'typescript', 'tsx': 'typescript',       /* TypeScript */
    'vb': 'vbnet',                               /* VB.NET */
    'vbs': 'vbscript',                          /* VBScript */
    'yml': 'yaml', 'yaml': 'yaml',           /* YAML */
    'zep': 'zephir'                        /* Zephir */
};
async function loadHighlight(lang) {
    const cleanLang = lang.toLowerCase().trim();
    if (window.hljs?.getLanguage(cleanLang)) return;
    if (!window.hljs) {
        await loadScript('./js/modules/highlight/highlight.min.js');
        hljs.configure({ throwUnescapedHTML: true, languages: ['plaintext'] });
    }
    const normalizedLang = HLJS_ALIASES[cleanLang] || cleanLang;
    if (normalizedLang === 'plaintext' || hljs.getLanguage(normalizedLang)) return;
    try { await loadScript(`./js/modules/highlight/languages/${normalizedLang}.min.js`);
    } catch (e) { console.warn(`Failed to load language: ${normalizedLang}`, e); return 'plaintext'; }
}
function loadScript(src) {
    return new Promise((resolve, reject) => { 
        const script = document.createElement('script'); script.src = src; script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
    });
}
function addCopyButton(block) {
    const wrapper = block.parentElement;
    if (!wrapper || !wrapper.classList.contains('code-wrapper')) return;
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.innerHTML = `
        <svg class="copy-icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M3 16a1 1 0 0 1-1-1v-5a8 8 0 0 1 8-8h5a1 1 0 0 1 1 1v.5a.5.5 0 0 1-.5.5H10a6 6 0 0 0-6 6v5.5a.5.5 0 0 1-.5.5H3Z" class=""></path><path fill="currentColor" d="M6 18a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-4h-3a5 5 0 0 1-5-5V6h-4a4 4 0 0 0-4 4v8Z" class=""></path><path fill="currentColor" d="M21.73 12a3 3 0 0 0-.6-.88l-4.25-4.24a3 3 0 0 0-.88-.61V9a3 3 0 0 0 3 3h2.73Z" class=""></path></svg>
        <svg class="check-icon" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>`;
    wrapper.appendChild(button);
    button.addEventListener('click', async () => {
        const code = block.querySelector('code').textContent;
        try {
            await navigator.clipboard.writeText(code); button.classList.add('copied'); setTimeout(() => button.classList.remove('copied'), 10000);
        } catch (err) { console.error('Failed to copy:', err); }
    });
}
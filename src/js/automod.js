class AutoMod {
    static #isMatch(text, pattern) {
        if (pattern instanceof RegExp) return pattern.test(text);

        let regex;
        const clean = pattern.replace(/^\*|\*$/g, "");

        if (pattern.startsWith("*") && pattern.endsWith("*")) {
            regex = new RegExp(clean, "i");
        } else if (pattern.startsWith("*")) {
            regex = new RegExp(clean + "\\b", "i");
        } else if (pattern.endsWith("*")) {
            regex = new RegExp("\\b" + clean, "i");
        } else {
            regex = new RegExp(`\\b${clean}\\b`, "i");
        }

        return regex.test(text);
    }

    static checkMessage(msg, list, exceptions) {
        return list.some(p => {
            if (this.#isMatch(msg, p)) {
                return !exceptions.some(ex => this.#isMatch(msg, ex));
            }
            return false;
        });
    }
    
    static checkMessageOld(msg, list, exceptions) {
        return list.some(p => {
            let match; if (p instanceof RegExp) {
                match = p.test(msg);
            } else {
                if (p.startsWith("*") && p.endsWith("*")) {
                    match = new RegExp(p.replace(/^\*|\*$/g, ""), "i").test(msg);
                } else if (p.startsWith("*")) {
                    match = new RegExp(p.replace(/^\*|\*$/g, "") + "\\b", "i").test(msg);
                } else if (p.endsWith("*")) {
                    match = new RegExp("\\b" + p.replace(/^\*|\*$/g, ""), "i").test(msg);
                } else { match = new RegExp(`\\b${p}\\b`, "i").test(msg); }
            }
            if (match) {
                return !exceptions.some(ex => {
                    let exceptionMatch;
                    if (ex.startsWith("*") && ex.endsWith("*")) {
                        exceptionMatch = new RegExp(ex.replace(/^\*|\*$/g, ""), "i").test(msg);
                    } else if (ex.startsWith("*")) {
                        exceptionMatch = new RegExp(ex.replace(/^\*|\*$/g, "") + "\\b", "i").test(msg);
                    } else if (ex.endsWith("*")) {
                        exceptionMatch = new RegExp("\\b" + ex.replace(/^\*|\*$/g, ""), "i").test(msg);
                    } else { exceptionMatch = new RegExp(`\\b${ex}\\b`, "i").test(msg); }
                    return exceptionMatch;
                });
            }
            return false;
        });
    }

    static system = {
        strings: [
            // actual bad phrases
            "heil hitler"
        ],
        matches: [
            /\b(n+i+g+g+|f+a+g+|r+e+t+a+r+d+|t+r+a+n+n+y+|k+i+k+|s+l+a+n+t+|g+y+p+s+y+|w+e+t+b+a+c+k+)\w*\b/i, // slurs
            /\b(neo\s*nazi|kkk|klan\s*member)\b/i // hate groups
        ],
        exceptions: []
    }

    static user = {
        strings: JSON.parse(localStorage.getItem("userBlockedStrings")) || [],
        matches: (JSON.parse(localStorage.getItem("userBlockedMatches")) || []).map(r => new RegExp(r, "i")),
        exceptions: JSON.parse(localStorage.getItem("userExceptions")) || []
    }
}
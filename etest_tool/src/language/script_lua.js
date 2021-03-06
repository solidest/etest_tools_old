const conf = {
    comments: {
        lineComment: "--",
        blockComment: ["--[[", "]]"],
    },
    brackets: [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
    ],
    autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"', notIn: ["string"] },
        { open: "'", close: "'", notIn: ["string"] },
    ],
    surroundingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
    ],
    indentationRules: {
        increaseIndentPattern: new RegExp(
            "^((?!(\\-\\-)).)*((\\b(else|function|then|do|repeat)\\b((?!\\b(end|until)\\b).)*)|(\\{\\s*))$"
        ),
        decreaseIndentPattern: new RegExp(
            "^\\s*((\\b(elseif|else|end|until)\\b)|(\\})|(\\)))"
        ),
    },
};

const language = {
    defaultToken: "",
    tokenPostfix: ".lua",

    // @ts-ignore
    keywords: [
        "false",
        "local",
        "nil",
        "true",
    ],
    brackets: [
        { token: "delimiter.bracket", open: "{", close: "}" },
        { token: "delimiter.array", open: "[", close: "]" },
        { token: "delimiter.parenthesis", open: "(", close: ")" },
    ],
    operators: [
        "+",
        "-",
        "*",
        "/",
        "%",
        "^",
        "#",
        "==",
        "~=",
        "<=",
        ">=",
        "<",
        ">",
        "=",
        ";",
        ":",
        ",",
        ".",
        "..",
        "...",
        "&&",
        "!",
        "!=",
        "||",
    ],
    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    // The main tokenizer for our languages
    tokenizer: {
        root: [
            [/\b(protocol|device|record|entry|print|exit|assert|verify|delay|now|error|message|pack|unpack|send|recv|ioctl|write|read|nameof|ask|insert|async|log|string|math|table|utf8)\b/, 'type.identifier'],
            [/\b(require|return|goto|break|function|if|then|else|elseif|return|end|for|repeat|in|do|until|while|continue)\b/, 'regexp'],
            [/\b(and|or|not)\b/, 'operators'],
            [/\b^[a-zA-Z_$][a-zA-Z0-9_]*(?=[;(])/, 'number.binary'],
            // identifiers and keywords
            [
                /[a-zA-Z_]\w*/,
                {
                    cases: {
                        "@keywords": { token: "keyword.$0" },
                        "@default": "attribute.name",
                    },
                },
            ],
            // whitespace
            { include: "@whitespace" },
            // keys
            [
                /(,)(\s*)([a-zA-Z_]\w*)(\s*)(:)(?!:)/,
                ["delimiter", "", "key", "", "delimiter"],
            ],
            [
                /({)(\s*)([a-zA-Z_]\w*)(\s*)(:)(?!:)/,
                ["@brackets", "", "key", "", "delimiter"],
            ],
            // Multiline string, needs to be added before brackets
            [/\[(=*)\[/, "string", "@string_multiline"],
            // delimiters and operators
            [/[{}()\[\]]/, "@brackets"],
            [
                /@symbols/,
                {
                    cases: {
                        "@operators": "delimiter",
                        "@default": "",
                    },
                },
            ],
            // numbers
            [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
            [/0[xX][0-9a-fA-F_]*[0-9a-fA-F]/, "number.hex"],
            [/\d+?/, "number"],
            // delimiter: after number because of .\d floats
            [/[;,.]/, "delimiter"],
            // strings: recover on non-terminated strings
            [/"([^"\\]|\\.)*$/, "string.invalid"],
            [/'([^'\\]|\\.)*$/, "string.invalid"],
            [/"/, "string", '@string."'],
            [/'/, "string", "@string.'"],
        ],
        string_multiline: [
            [/[^\\\]\\\]]+/, "string"],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [/\](=*)\]/, "string", "@pop"],
        ],
        whitespace: [
            [/[ \t\r\n]+/, ""],
            [/\/\*/, "comment", "@comment"],
            [/\/\/.*$/, "comment"],
            [/--\[([=]*)\[/, "comment", "@comment.$1"],
            [/--.*$/, "comment"],
        ],
        comment: [
            // This breaks comment blocks
            // [/[^\/*]+/, "comment"],
            [/\/\*/, "comment", "@push"], // nested comment
            [/\*\//, "comment", "@pop"],
            [/[\/*]/, "comment"],
            // [/[^\]]+/, "comment"],
            [
                /\]([=]*)\]/,
                {
                    cases: {
                        "$1==$S2": { token: "comment", next: "@pop" },
                        "@default": "comment",
                    },
                },
            ],
            [/./, "comment.content"],
        ],
        string: [
            [/[^\\"']+/, "string"],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [
                /["']/,
                {
                    cases: {
                        "$#==$S2": { token: "string", next: "@pop" },
                        "@default": "string",
                    },
                },
            ],
        ],
    },
};

export default {conf, language}
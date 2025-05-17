// providers/commentTokens.js

/**
 * Définition des marqueurs de commentaires par languageId,
 * basés sur les language-configuration.json de VS Code.
 */
const commentTokens = {
    javascript:  { line: ['//'],      block: ['/*','*/'] },
    typescript:  { line: ['//'],      block: ['/*','*/'] },
    python:      { line: ['#'] },
    java:        { line: ['//'],      block: ['/*','*/'] },
    cpp:         { line: ['//'],      block: ['/*','*/'] },
    c:           { line: ['//'],      block: ['/*','*/'] },
    cs:          { line: ['//'],      block: ['/*','*/'] },
    go:          { line: ['//'],      block: ['/*','*/'] },
    php:         { line: ['//','#'],  block: ['/*','*/'] },
    ruby:        { line: ['#'] },
    shellscript: { line: ['#'] },
    powershell:  { line: ['#'] },
    html:        { block: ['<!--','-->'] },
    xml:         { block: ['<!--','-->'] },
    css:         { block: ['/*','*/'] },
    scss:        { block: ['/*','*/'] },
    less:        { block: ['/*','*/'] },
    json:        { line: ['//'],      block: ['/*','*/'] },
    markdown:    { line: ['<!--'],    block: ['<!--','-->'] },
    sql:         { line: ['--'],      block: ['/*','*/'] },
    yaml:        { line: ['#'] },
    dockerfile:  { line: ['#'] },
    ini:         { line: [';','#'] },
    rust:        { line: ['//'],      block: ['/*','*/'] },
};

module.exports = commentTokens;
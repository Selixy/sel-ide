const vscode = require('vscode');
const { applyGhost, clearAll } = require('./decorationProvider');

// État mémorisé...
let lastEditor, lastStartPos, lastLines, lastColor;

async function acceptSuggestion() {
  const editor = lastEditor;
  if (!editor || !lastStartPos) return;
  const endPos = new vscode.Position(
    lastStartPos.line + lastLines.length,
    0
  );

  await editor.edit(eb => {
    eb.delete(new vscode.Range(lastStartPos, endPos));
    eb.insert(lastStartPos, lastLines.join('\n'));
  });

  clearAll(editor);
  lastEditor = null;
  lastStartPos = null;
  lastLines = [];
  lastColor = '';

  // Désactive le context
  await vscode.commands.executeCommand(
    'setContext',
    'ghostSuggestionVisible',
    false
  );
}

function suggestSet(editor) {
  if (!editor) return;

  // Prépare le ghost…
  const pythonAdd = ['def add(a, b):', '    return a + b'];
  const startPos  = new vscode.Position(0, 0);
  const color     = 'rgba(128,128,128,0.5)';

  applyGhost(editor, startPos, pythonAdd, color);

  lastEditor   = editor;
  lastStartPos = startPos;
  lastLines    = pythonAdd;
  lastColor    = color;

  // Active le context pour le keybinding
  vscode.commands.executeCommand(
    'setContext',
    'ghostSuggestionVisible',
    true
  );
}

module.exports = { suggestSet, acceptSuggestion };

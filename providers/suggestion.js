const vscode = require('vscode');
const { applyGhost, clearAll } = require('./decorationProvider');
const { generateCompletion }   = require('../test/testGeneration');
const { collectContext }       = require('./contextCollector');

// État mémorisé...
let lastEditor, lastStartPos, lastEndPos, lastLines;

async function acceptSuggestion() {
  const editor = lastEditor;
  if (!editor || !lastStartPos || !lastEndPos) return;

  await editor.edit(eb => {
    eb.delete(new vscode.Range(lastStartPos, lastEndPos));
    eb.insert(lastStartPos, lastLines.join('\n'));
  });

  clearAll(editor);
  lastEditor = lastStartPos = lastEndPos = lastLines = null;

  await vscode.commands.executeCommand(
    'setContext',
    'ghostSuggestionVisible',
    false
  );
}

async function suggestSet(editor) {
  if (!editor) return;

  // 1) Contexte complet
  const ctx = await collectContext(
    editor.document,
    editor.selection.active
  );

  // 2) Appel de l’API (stub)
  const { startPos, endPos, replacement } = await generateCompletion(ctx);

  // 3) Affichage du ghost
  const lines = replacement.split('\n');
  applyGhost(editor, startPos, lines, 'rgba(128,128,128,0.5)');

  // 4) Mémorisation pour l’acceptation
  lastEditor   = editor;
  lastStartPos = startPos;
  lastEndPos   = endPos;
  lastLines    = lines;

  await vscode.commands.executeCommand(
    'setContext',
    'ghostSuggestionVisible',
    true
  );
}

module.exports = { suggestSet, acceptSuggestion };

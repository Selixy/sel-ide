// providers/triggerSuggestion.js
const vscode = require('vscode');

/**
 * Installe un trigger “idle + activity” :
 * - onActivity(editor) est appelé à chaque événement (cursor, saisie, switch d’éditeur)
 * - onIdle(editor) est appelé 250 ms après le dernier événement
 *
 * @param {vscode.ExtensionContext} context
 * @param {(editor: vscode.TextEditor) => void} onIdle
 * @param {(editor: vscode.TextEditor) => void} onActivity
 */
function registerTrigger(context, onIdle, onActivity) {
  let idleTimer;

  function handle(editor) {
    if (!editor) return;
    // 1) callback d’activité
    if (onActivity) {
      onActivity(editor);
    }
    // 2) reset et re-planification du callback idle
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      onIdle(editor);
    }, 250);
  }

  // Souscriptions aux événements
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(e =>
      handle(e.textEditor)
    ),
    vscode.workspace.onDidChangeTextDocument(e => {
      const editor = vscode.window.activeTextEditor;
      if (editor && e.document === editor.document) {
        handle(editor);
      }
    }),
    vscode.window.onDidChangeActiveTextEditor(editor =>
      handle(editor)
    )
  );

  // Premier appel pour initialiser
  handle(vscode.window.activeTextEditor);
}

module.exports = { registerTrigger };

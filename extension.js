// Charge .env si présent
const path   = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const vscode                       = require('vscode');
const { registerSuggestionProvider } = require('./providers/suggestion');

let idleTimer;

/**
 * Activation de l’extension : timer et provider centralized.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const getDelay = () =>
    vscode.workspace.getConfiguration('selIDE').get('idleDelay', 250);

  // 1) Timer pour déclencher inline-suggest après inactivité
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(() => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        vscode.commands.executeCommand('editor.action.inlineSuggest.trigger');
      }, getDelay());
    })
  );

  // 2) Enregistre le provider unique défini dans providers/suggestion.js
  registerSuggestionProvider(context);
}

/**
 * Nettoyage à la désactivation.
 */
function deactivate() {
  clearTimeout(idleTimer);
}

module.exports = { activate, deactivate };

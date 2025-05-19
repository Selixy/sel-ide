// extension.js
const vscode = require('vscode');
const { registerTrigger } = require('./providers/triggerSuggestion');
const { suggestSet, acceptSuggestion } = require('./providers/suggestion');
const { clearAll } = require('./providers/decorationProvider');

function activate(context) {
  // onIdle      = suggestSet
  // onActivity  = clearAll
  registerTrigger(context, suggestSet, clearAll);

  // Commande “Accept Suggestion”
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'extension.acceptSuggestion',
      acceptSuggestion
    )
  );
}

function deactivate() {}

module.exports = { activate, deactivate };

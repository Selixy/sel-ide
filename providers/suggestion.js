// providers/suggestion.js
const vscode               = require('vscode');
const { generateCompletion } = require('./generationAPI');

/**
 * Fournit les InlineCompletionItems à partir
 * de l’objet retourné par generateCompletion.
 */
async function provideInlineCompletionItems(document, position) {
  let spec;
  try {
    spec = await generateCompletion(document, position);
  } catch (e) {
    console.error('Sel_IDE DEBUG [suggestion] API error →', e);
    return [];
  }

  const { isCompletion, startLine, endLine, replacement } = spec;

  // On supprime toujours la ligne courante
  const currentLine = document.lineAt(position.line);
  const fullLineRange = new vscode.Range(
    new vscode.Position(position.line, 0),
    new vscode.Position(position.line, currentLine.text.length)
  );

  if (isCompletion) {
    // → insertion après suppression de la ligne
    return [ new vscode.InlineCompletionItem(replacement, fullLineRange) ];
  } else {
    // → remplacement multi-lignes
    const startPos = new vscode.Position(startLine, 0);
    const endPos   = new vscode.Position(
      endLine,
      document.lineAt(endLine).text.length
    );
    const range = new vscode.Range(startPos, endPos);
    return [ new vscode.InlineCompletionItem(replacement, range) ];
  }
}

/**
 * Enregistre le provider inline.
 */
function registerSuggestionProvider(context) {
  const provider = vscode.languages.registerInlineCompletionItemProvider(
    { pattern: '**/*' },
    { provideInlineCompletionItems }
  );
  context.subscriptions.push(provider);
}

module.exports = { registerSuggestionProvider };

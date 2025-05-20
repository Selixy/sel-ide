// test/testGeneration.js
const vscode = require('vscode');

/**
 * @typedef {import('../providers/contextCollector').CompletionContext} CompletionContext
 * @typedef {{ startPos: vscode.Position, endPos: vscode.Position, replacement: string }} ApplyPatchArgs
 */

/**
 * @param {CompletionContext} ctx
 * @returns {Promise<ApplyPatchArgs>}
 */
async function generateCompletion(ctx) {
  // Stub de test : on retourne directement deux Position
  const replacement = [
    "def procces_data(data):",
    "    result = {}",
    "    for item in data:",
    "        if 'value' in item:",
    "            result[item['id']] = item['value'] * 2",
    "    return result"
  ].join('\n');

  // Création de Positions VSCode
  const startPos = new vscode.Position(5, 0);
  const endPos   = new vscode.Position(10, 17);

  return { startPos, endPos, replacement };
}

module.exports = { generateCompletion };

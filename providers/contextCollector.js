// providers/contextCollector.js
const path   = require('path');
const vscode = require('vscode');

/**
 * @typedef {Object} CompletionContext
 * @property {string} fileName      Nom du fichier (ex. "index.js")
 * @property {string} relativePath  Chemin workspace-relatif
 * @property {string} languageId    Langage du document ("javascript", "python", …)
 * @property {string} fullText      Contenu intégral du document
 * @property {number} lineCount     Nombre total de lignes
 * @property {number} cursorLine    Ligne du curseur (0-based)
 * @property {number} cursorChar    Colonne du curseur (0-based)
 */

/**
 * Récupère tout le contexte utile à la génération.
 * @param {vscode.TextDocument} document
 * @param {vscode.Position}     position
 * @returns {Promise<CompletionContext>}
 */
async function collectContext(document, position) {
  const fileName     = path.basename(document.fileName);
  const relativePath = vscode.workspace.asRelativePath(document.fileName);
  const languageId   = document.languageId;
  const fullText     = document.getText();
  const lineCount    = document.lineCount;
  const cursorLine   = position.line;
  const cursorChar   = position.character;

  return { fileName, relativePath, languageId, fullText, lineCount, cursorLine, cursorChar };
}

module.exports = { collectContext };

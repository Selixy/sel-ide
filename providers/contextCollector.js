// providers/contextCollector.js
const vscode = require('vscode');
const path = require('path');

/**
 * Récupère le contexte local du fichier et du curseur
 * @param {vscode.TextDocument} document
 * @param {vscode.Position} position
 * @returns {{
 *   fileName: string,
 *   relativePath: string,
 *   languageId: string,
 *   fullText: string,
 *   cursorLine: number,
 *   cursorCharacter: number,
 *   lineCount: number
 * }}
 */
function collectContext(document, position) {
  const fileName        = path.basename(document.fileName);
  const relativePath    = vscode.workspace.asRelativePath(document.uri);
  const languageId      = document.languageId;
  const fullText        = document.getText();
  const cursorLine      = position.line;
  const cursorCharacter = position.character;
  const lineCount       = document.lineCount;

  return {
    fileName,
    relativePath,
    languageId,
    fullText,
    cursorLine,
    cursorCharacter,
    lineCount // ← maintenant accessible dans generationAPI.js
  };
}

module.exports = { collectContext };

const path          = require('path');
const vscode        = require('vscode');
const commentTokens = require('./commentTokens');

/**
 * Extrait N lignes autour du curseur pour le contexte local.
 */
function getLocalContext(document, position, contextLines = 5) {
  const startLine = Math.max(0, position.line - contextLines);
  const endLine   = Math.min(document.lineCount - 1, position.line + contextLines);
  const lines     = [];
  for (let i = startLine; i <= endLine; i++) {
    lines.push(document.lineAt(i).text);
  }
  return { startLine, endLine, lines };
}

/**
 * Extrait un contexte plat en variables distinctes.
 *
 * @param {vscode.TextDocument} document
 * @param {vscode.Position}    position
 */
function getContext(document, position) {
  // — Infos de base
  const language   = document.languageId;
  const fileType   = path.extname(document.fileName) || '';
  const lineText   = document.lineAt(position.line).text;
  const before     = lineText.slice(0, position.character);

  // — Détection de commentaire
  const tokens    = commentTokens[language] || {};
  let inComment   = false;
  if (tokens.line) {
    inComment = tokens.line.some(tok => before.trimStart().startsWith(tok));
  }
  if (!inComment && tokens.block) {
    const [open, close] = tokens.block;
    const lastOpen      = before.lastIndexOf(open);
    const lastClose     = before.lastIndexOf(close);
    inComment = lastOpen !== -1 && lastOpen > lastClose;
  }

  // — Préfixe tapé
  const m      = before.match(/[\w$]+$/);
  const prefix = m ? m[0] : '';

  // — Contexte local
  const {
    startLine: localStartLine,
    endLine:   localEndLine,
    lines:      localLines
  } = getLocalContext(document, position, 5);

  // — Fichier courant
  const currentFileName    = document.fileName || 'Untitled';
  const currentFileContent = document.getText();

  // — Fichiers visibles (splits)
  const visibleFiles = vscode.window.visibleTextEditors
    .map(e => e.document)
    .filter(doc => doc !== document)
    .map(doc => ({
      fileName: doc.fileName || 'Untitled',
      content:  doc.getText()
    }));

  // — Fichiers cachés
  const hiddenFiles = vscode.workspace.textDocuments
    .filter(doc =>
      doc !== document &&
      !vscode.window.visibleTextEditors.some(e => e.document === doc)
    )
    .map(doc => ({
      fileName: doc.fileName || 'Untitled',
      content:  doc.getText()
    }));

  const allOpenFiles = visibleFiles.concat(hiddenFiles);

  return {
    language,
    fileType,
    inComment,
    prefix,
    before,

    localStartLine,
    localEndLine,
    localLines,

    currentFileName,
    currentFileContent,

    visibleFiles,
    hiddenFiles,
    allOpenFiles
  };
}

module.exports = { getContext };

const vscode = require('vscode');

// Décoration pour masquer du texte
const hideDecorationType = vscode.window.createTextEditorDecorationType({
  color: 'transparent'
});

// Décoration pour le ghost-text (multi-lignes via renderOptions)
const ghostDecorationType = vscode.window.createTextEditorDecorationType({
  rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
});

/**
 * Applique un ghost-text multi-lignes ET masque
 * automatiquement les lignes sous-jacentes.
 *
 * @param {vscode.TextEditor} editor
 * @param {vscode.Position}     startPos  Position de départ
 * @param {string[]}            lines     Tableau de lignes à afficher
 * @param {string|vscode.ThemeColor} color Couleur du ghost
 */
function applyGhost(editor, startPos, lines, color) {
  if (!editor) return;

  // Masquage de la plage sous-jacente
  const endPos   = new vscode.Position(startPos.line + lines.length, 0);
  const hideRange = new vscode.Range(startPos, endPos);
  editor.setDecorations(hideDecorationType, [hideRange]);

  // Préparation des options pour chaque ligne de ghost
  const opts = lines.map((content, i) => {
    const sanitized = content.replace(/^ +/, s => '\u00A0'.repeat(s.length));
    const pos = new vscode.Position(startPos.line + i, startPos.character);
    return {
      range: new vscode.Range(pos, pos),
      renderOptions: {
        before: {
          contentText: sanitized,
          color,
          margin: '0 0.5em 0 0'
        }
      }
    };
  });

  editor.setDecorations(ghostDecorationType, opts);
}

/**
 * Efface **toutes** les décorations de ghost ou de masquage.
 */
function clearAll(editor) {
  if (!editor) return;
  editor.setDecorations(hideDecorationType, []);
  editor.setDecorations(ghostDecorationType, []);
}

module.exports = {
  applyGhost,
  clearAll
};

// providers/generationAPI.js
const fetch          = require('node-fetch');
const vscode         = require('vscode');
const { getContext } = require('./contextExtractor');

// ——————————————————————————————————————
// Configuration du function-calling et des valeurs par défaut
// ——————————————————————————————————————

const FUNCTION_DEFINITIONS = [
  {
    name:        'applyPatch',
    description: 'Instructions pour corriger ou compléter le code (y compris commentaires)',
    parameters: {
      type: 'object',
      properties: {
        isCompletion: { type:'boolean', description:'true = insertion seule, false = remplacement de lignes' },
        startLine:    { type:'integer', description:'Index 0-based de la 1ère ligne à toucher' },
        endLine:      { type:'integer', description:'Index 0-based de la dernière ligne incluse' },
        replacement:  { type:'string',  description:'Le texte brut à insérer ou remplacer' }
      },
      required: ['isCompletion','startLine','endLine','replacement']
    }
  }
];

const DEFAULTS = {
  model:       'gpt-4.1-nano',
  apiUrl:      'https://api.openai.com/v1/chat/completions',
  maxTokens:   256,
  temperature: 1.5
};

// ——————————————————————————————————————
// Fonction principale
// ——————————————————————————————————————

/**
 * Génère le patch via un prompt en langage courant,
 * intégrant tous les éléments de contexte dans une unique phrase narrative.
 *
 * @param {import('vscode').TextDocument} document
 * @param {import('vscode').Position}      position
 * @returns {Promise<{isCompletion:boolean,startLine:number,endLine:number,replacement:string}>}
 */
async function generateCompletion(document, position) {
  // 1) Extraction du contexte plat
  const ctx    = getContext(document, position);
  const config = vscode.workspace.getConfiguration('selIDE');

  // 2) Clé API et URL
  const apiKey = process.env.SELIDE_API_KEY || config.get('apiKey','');
  const apiUrl = config.get('apiUrl', DEFAULTS.apiUrl);
  if (!apiKey) {
    throw new Error('Clé API manquante — définis SELIDE_API_KEY ou selIDE.apiKey.');
  }

  // 3) Construire le prompt système
  const systemPrompt = `
Tu es un assistant IA intégré à un IDE, expert en ${ctx.language}.
Tu gères la correction et l’auto-complétion de code et commentaires.
Ta réponse doit exclusivement consister en un appel de fonction :
applyPatch({ isCompletion, startLine, endLine, replacement });
Sans autre explication ni formatage.
`.trim();

  // 4) Construire un prompt utilisateur en une seule phrase narrative
  const userPrompt = `
Dans le projet tu as ${ctx.visibleFiles.length} fichier(s) visibles (${ctx.visibleFiles.map(f=>f.fileName).join(', ')})
et ${ctx.hiddenFiles.length} autre(s) ouvert(s) en arrière-plan.
L’utilisateur travaille sur "${ctx.currentFileName}" (type ${ctx.fileType}), 
le langage est ${ctx.language}, 
il ${ctx.inComment ? 'se trouve' : 'ne se trouve pas'} dans un commentaire,
et vient de taper le préfixe "${ctx.prefix}" à la position ${position.line+1}:${position.character+1}.
Voici les ${ctx.localLines.length} lignes autour du curseur (lignes ${ctx.localStartLine+1} à ${ctx.localEndLine+1}) :
${ctx.localLines.map((l,i)=>`  ${ctx.localStartLine+i+1}: ${l}`).join('\n')}

Sur cette base, détermine si tu dois insérer (isCompletion=true) ou remplacer (isCompletion=false)
une ou plusieurs lignes du document, et renvoie l’appel applyPatch(...) correspondant.
`.trim();

  // 5) Envoi de la requête
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model:          config.get('model', DEFAULTS.model),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt }
      ],
      functions:      FUNCTION_DEFINITIONS,
      function_call:  { name: 'applyPatch' },
      max_tokens:     config.get('maxTokens', DEFAULTS.maxTokens),
      temperature:    config.get('temperature', DEFAULTS.temperature)
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI Error ${res.status}: ${err}`);
  }

  // 6) Traitement de la réponse function_call
  const { choices } = await res.json();
  const fc          = choices[0].message.function_call;
  if (!fc?.arguments) {
    throw new Error('Aucun appel de fonction reçu de l’API.');
  }

  // 7) JSON.parse unique des arguments
  return JSON.parse(fc.arguments);
}

module.exports = { generateCompletion };

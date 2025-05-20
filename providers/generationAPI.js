// // providers/generationAPI.js
// const fetch   = require('node-fetch');
// const vscode  = require('vscode');
// const { collectContext } = require('./contextCollector');

// const FUNCTION_DEFINITIONS = [
//   {
//     name:        'applyPatch',
//     description: 'Instructions pour format de patch',
//     parameters: {
//       type: 'object',
//       properties: {
//         startLine:   { type: 'integer', description: 'Index 0-based de la 1ère ligne à toucher' },
//         endLine:     { type: 'integer', description: 'Index 0-based de la dernière ligne incluse' },
//         replacement: { type: 'string',  description: 'Le texte brut à insérer ou remplacer' }
//       },
//       required: ['startLine','endLine','replacement']
//     }
//   }
// ];

// const DEFAULTS = {
//   model:       'gpt-4.1-nano',
//   apiUrl:      'https://api.openai.com/v1/chat/completions',
//   maxTokens:   256,
//   temperature: 0.2
// };

// /**
//  * @param {vscode.TextDocument} document
//  * @param {vscode.Position}     position
//  * @returns {Promise<{startLine:number,endLine:number,replacement:string}>}
//  */
// async function generateCompletion(document, position) {
//   const ctx = await collectContext(document, position);
//   if (!ctx) throw new Error('Contexte introuvable.');

//   const config = vscode.workspace.getConfiguration('selIDE');
//   const apiKey = process.env.SELIDE_API_KEY || config.get('apiKey','');
//   const apiUrl = config.get('apiUrl', DEFAULTS.apiUrl);
//   if (!apiKey) throw new Error('Clé API manquante.');

//   const systemPrompt = `
// Tu es une IA intégrée à un IDE, spécialisée dans la génération de patchs de code.
// Ta réponse doit **EXCLUSIVEMENT** être un appel de fonction JavaScript au format :
// applyPatch({ startLine, endLine, replacement });
// Sans autre texte.
// `.trim();

//   const userPrompt = `
// Contexte :
// - Fichier : ${ctx.fileName}
// - Chemin : ${ctx.relativePath}
// - Langage : ${ctx.languageId}
// - Curseur : ligne ${ctx.cursorLine+1}, colonne ${ctx.cursorCharacter+1}

// Contenu complet du fichier :
// ${ctx.fullText}

// Le document contient ${ctx.lineCount} lignes (indexées de 0 à ${ctx.lineCount - 1}).
// startLine et endLine doivent impérativement être dans cette plage :
// [0 .. ${ctx.lineCount - 1}]
// Sinon, le patch sera invalide et rejeté par l'éditeur.

// Sur cette base, détermine :
// - startLine : ligne de début du patch
// - endLine   : ligne de fin (incluse)
// - replacement : texte à insérer à la place

// Et retourne uniquement :
// applyPatch({ startLine, endLine, replacement });
// `.trim();

//   const res = await fetch(apiUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type':  'application/json',
//       'Authorization': `Bearer ${apiKey}`
//     },
//     body: JSON.stringify({
//       model:         config.get('model', DEFAULTS.model),
//       messages:      [
//         { role: 'system', content: systemPrompt },
//         { role: 'user',   content: userPrompt }
//       ],
//       functions:     FUNCTION_DEFINITIONS,
//       function_call: { name: 'applyPatch' },
//       max_tokens:    config.get('maxTokens', DEFAULTS.maxTokens),
//       temperature:   config.get('temperature', DEFAULTS.temperature)
//     })
//   });

//   if (!res.ok) {
//     const txt = await res.text();
//     throw new Error(`OpenAI Error ${res.status}: ${txt}`);
//   }

//   const payload = await res.json();

//   const fc = payload.choices?.[0]?.message?.function_call;
//   if (!fc?.arguments) {
//     throw new Error('Aucun applyPatch détecté dans la réponse.');
//   }

//   // DEBUG brut de l’appel de fonction
//   console.log('[selIDE DEBUG] arguments GPT brut :', fc.arguments);

//   return JSON.parse(fc.arguments);
// }

// module.exports = { generateCompletion };

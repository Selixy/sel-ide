# sel-ide

**Une extension légère d’auto-complétion et de correction IA pour VS Codium / VS Code, conçue pour offrir une alternative rapide et respectueuse de la vie privée aux gros plugins IA.**

---

## Fonctionnalités

- **Auto-complétion contextualisée**  
  Après un délai d’inactivité (`idleDelay`), sel-ide suggère la suite du code ou remplace des lignes incomplètes.  
- **Corrections “applyPatch”**  
  Que ce soit du code, des commentaires ou un petit algorithme, l’IA renvoie un patch structuré (`isCompletion`, `startLine`, `endLine`, `replacement`) qui s’applique directement.  
- **Mode débogage local**  
  Sans clé API définie, l’extension affiche le contexte JSON en guise de “ghost-text” pour vous aider à voir ce qui serait envoyé à l’IA.  
- **Contexte riche**  
  Extrait automatiquement :  
  - Le langage et l’extension du fichier courant  
  - Les quelques lignes autour du curseur  
  - Les fichiers visibles et ceux ouverts en arrière-plan  
  - Le préfixe tapé et l’état (dans un commentaire ou non)  
- **Commande de test intégrée**  
  Exécutez `sel-ide.testRequest` pour insérer un snippet IA de test sans quitter votre éditeur.  

---

## Installation

1. **Téléchargez ou générez** le fichier VSIX de sel-ide (ex. `sel-ide-0.0.1.vsix`).  
2. Dans VS Codium / VS Code :  
   - Ouvrez la palette (Ctrl+Shift+P)  
   - Tapez **Extensions: Install from VSIX…**  
   - Sélectionnez votre `.vsix`  

---

## Utilisation

1. Ouvrez un fichier pris en charge (tout langage)  
2. Tapez normalement : après `idleDelay` ms sans frappe, la suggestion IA apparaîtra en gris  
3. Appuyez sur **Tab** ou **Entrée** pour l’accepter  
4. Pour tester l’API manuellement, lancez la commande **Sel IDE: Test Request** (Ctrl+Shift+P → sel-ide.testRequest), et un snippet de test sera inséré

---

## Paramètres de l’extension

| Clé                            | Description                                                     | Valeur par défaut                            |
| ------------------------------ | --------------------------------------------------------------- | -------------------------------------------- |
| `selIDE.idleDelay`             | Délai (ms) après la dernière frappe la suggestion IA            | `250`                                        |
| `selIDE.apiKey`                | Votre clé OpenAI pour la complétion distante                    | `""`                                         |
| `selIDE.apiUrl`                | URL de l’endpoint IA                                            | `https://api.openai.com/v1/chat/completions` |
| `selIDE.model`                 | Modèle à interroger                                             | `gpt-4.1-nano`                               |
| `selIDE.maxTokens`             | Nombre maximal de tokens générés                                | `256`                                         |
| `selIDE.temperature`           | Créativité (0 = conservateur, 2 = plus créatif)                 | `1.5`                                        |

> **Astuce** : Vous pouvez définir `selIDE.apiKey` dans un fichier `.env` à la racine de votre workspace, ou directement dans vos settings utilisateur.

---

## Comment ça marche ?

1. **Détection d’inactivité**  
   L’extension écoute `onDidChangeTextDocument`. Après `idleDelay` ms sans nouvelle frappe, elle déclenche `editor.action.inlineSuggest.trigger`.  
2. **Extraction du contexte**  
   Grâce à `contextExtractor.js`, elle rassemble :  
   - Le langage, l’extension et le préfixe sous le curseur  
   - Quelques lignes autour du curseur  
   - Le contenu du fichier actif et des autres fichiers ouverts  
   - L’état “dans un commentaire”  
3. **Appel IA**  
   `generationAPI.js` construit un prompt clair, appelle l’API OpenAI (ou stub local), en mode **function-calling**, et récupère un objet `{ isCompletion, startLine, endLine, replacement }`.  
4. **Application du patch**  
   Dans `suggestion.js`, on crée un `InlineCompletionItem` avec un **range** correspondant aux lignes à remplacer (ou un range zéro pour insertion), et VS Code affiche le ghost-text à l’emplacement exact.  

---

## Problèmes connus

- **Latence** : l’appel réseau peut prendre 200–500 ms selon la connexion.  
- **Fichiers volumineux** : un contexte trop long peut atteindre la limite de tokens.  
- **Commentaires complexes** : certains langages exotiques peuvent ne pas être détectés parfaitement.  

---

## Notes de version

### 0.0.1

- Patch structuré applyPatch  
- Contexte multi-fichiers  
- Première version : auto-complétion de base

---

> 📝 **Rédaction en Markdown**  
> Utilisez les raccourcis VS Code pour éditer et prévisualiser ce fichier :  
> - Split editor: `Ctrl+\`  
> - Toggle preview: `Ctrl+Shift+V`

**Bon codage avec sel-ide !**

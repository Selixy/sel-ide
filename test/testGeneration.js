const replacement = [
  "def procces_data(data):",
  "    result = {}",
  "    for item in data:",
  "        if 'value' in item:",
  "            result[item['id']] = item['value'] * 2",
  "    return result"
].join('\n');

async function generateCompletion(document, position) {
  return {
    startLine: 5,
    startCharacter: 0,
    endLine: 10,
    endCharacter: 17,
    replacement
  };
}

module.exports = { generateCompletion };

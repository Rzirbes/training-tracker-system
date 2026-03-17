/**
 *
 * @param name: joao dos santos
 * @returns Joao dos Santos
 */

export function nameToTitleCase(name: string) {
  const excludedWords = ['da', 'de', 'do', 'dos', 'e', 'das'];
  return name
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index === 0 || !excludedWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    })
    .join(' ')
    .trim();
}

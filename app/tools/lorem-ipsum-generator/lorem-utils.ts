export type LoremMode = 'paragraphs' | 'sentences' | 'words';

const baseWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
  'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt',
  'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'
];

function randomWord() {
  return baseWords[Math.floor(Math.random() * baseWords.length)];
}

export function generateLorem(count: number, mode: LoremMode): string {
  if (count <= 0) return '';
  switch (mode) {
    case 'words': {
      const words: string[] = [];
      for (let i = 0; i < count; i++) words.push(randomWord());
      return words.join(' ');
    }
    case 'sentences': {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        const parts: string[] = [];
        for (let j = 0; j < 12; j++) parts.push(randomWord());
        sentences.push(parts.join(' ') + '.');
      }
      return sentences.join(' ');
    }
    case 'paragraphs':
    default: {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        const sentences: string[] = [];
        for (let s = 0; s < 6; s++) {
          const words: string[] = [];
          for (let w = 0; w < 12; w++) words.push(randomWord());
          sentences.push(words.join(' ') + '.');
        }
        paragraphs.push(sentences.join(' '));
      }
      return paragraphs.join('\n\n');
    }
  }
}

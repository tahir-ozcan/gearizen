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
    case 'words':
      return Array.from({ length: count }, randomWord).join(' ');
    case 'sentences': {
      const sentence = () =>
        Array.from({ length: 12 }, randomWord).join(' ') + '.';
      return Array.from({ length: count }, sentence).join(' ');
    }
    case 'paragraphs':
    default: {
      const para = () =>
        Array.from({ length: 6 }, () =>
          Array.from({ length: 12 }, randomWord).join(' ') + '.'
        ).join(' ');
      return Array.from({ length: count }, para).join('\n\n');
    }
  }
}

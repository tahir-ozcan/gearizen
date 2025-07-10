import { generateLorem } from './lorem-utils'

test('generates correct number of words', () => {
  const words = generateLorem(5, 'words').split(' ')
  expect(words.length).toBe(5)
})

test('generates correct number of sentences', () => {
  const s = generateLorem(2, 'sentences').split('.')
  expect(s.filter(Boolean).length).toBe(2)
})

test('generates correct number of paragraphs', () => {
  const p = generateLorem(3, 'paragraphs').split(/\n+/)
  expect(p.filter(Boolean).length).toBe(3)
})

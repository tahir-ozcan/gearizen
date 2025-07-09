import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { generateLorem } from './lorem-utils'

test('generates correct number of words', () => {
  const words = generateLorem(5, 'words').split(' ')
  assert.is(words.length, 5)
})

test('generates correct number of sentences', () => {
  const s = generateLorem(2, 'sentences').split('.')
  assert.is(s.filter(Boolean).length, 2)
})

test('generates correct number of paragraphs', () => {
  const p = generateLorem(3, 'paragraphs').split(/\n+/)
  assert.is(p.filter(Boolean).length, 3)
})

test.run()

import { estimateSavings } from '../utils'

test('estimateSavings returns yearly difference', () => {
  expect(estimateSavings(100, 40)).toBe(720)
})

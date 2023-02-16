const listHelper = require('../utils/list_helper').dummy

test('dummy returns one', () => {
  const result = listHelper()
  expect(result).toBe(1)
})
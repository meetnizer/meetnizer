const Util = require('../services/util')

test('isValidDate - wrong date', async function () {
  const date = new Date('abc')
  expect(Util.isValidDate(date)).toBe(false)
})

test('isValidDate - empty date', async function () {
  const date = new Date('')
  expect(Util.isValidDate(date)).toBe(false)
})

test('isValidDate - valid date', async function () {
  const date = new Date()
  expect(Util.isValidDate(date)).toBe(true)
})

test('isValidDate - valid date with str', async function () {
  const date = new Date('2020/01/31')
  expect(Util.isValidDate(date)).toBe(true)
})

test('isValidDate - valid date with str', async function () {
  const date = new Date('31/01/2020')
  expect(Util.isValidDate(date)).toBe(false)
})

test('convertDateToDB - ok', async function () {
  const date = new Date('2020/01/31')
  const number = Util.convertDateToDB(date)
  expect(number).not.toBe(null)
})

test('convertDateToDB - error', async function () {
  const date = new Date('2020/01/32')
  try {
    Util.convertDateToDB(date)
  } catch (err) {
    expect(err.message).toBe('invalid.date.conversion')
  }
})

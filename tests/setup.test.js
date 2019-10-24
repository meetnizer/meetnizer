const setupSrv = require('../services/setup')
const appLocalPath = __dirname
const fs = require('fs')
const path = require('path')

function removeFile () {
  const file = setupSrv.getConfigFileName(appLocalPath)
  if (fs.existsSync(file)) { fs.unlinkSync(file) }
}

test('getConfigFileName', function () {
  expect(setupSrv.getConfigFileName(appLocalPath)).toBe(path.join(__dirname, 'settings.json'))
})

test('isConfigured()', function () {
  removeFile()
  const config = setupSrv.isConfigured(appLocalPath)
  expect(config).toBe(false)
})

test('createConfig()', function () {
  const dbPath = `${__dirname}/mydb.db`
  setupSrv.createConfigFile(appLocalPath, dbPath)
  const config = setupSrv.getConfiguration(appLocalPath)
  expect(config.dbFiles[0]).toBe(dbPath)
  expect(config.timerDefault).toBe(5)
  removeFile()
})

test('saveConfig()', function () {
  const dbPath = `${__dirname}/mydb.db`
  const dbPath1 = `${__dirname}/mydb1.db`
  setupSrv.createConfigFile(appLocalPath, dbPath)

  var config = setupSrv.getConfiguration(appLocalPath)
  config.dbFiles.push(dbPath1)

  setupSrv.saveConfig(appLocalPath, config)

  config = setupSrv.getConfiguration(appLocalPath)
  expect(config.dbFiles[0]).toBe(dbPath)
  expect(config.dbFiles[1]).toBe(dbPath1)
  expect(config.timerDefault).toBe(5)

  removeFile()
})

const setupSrv = require('../services/setup')
const homedir = require('os').homedir()
const fs = require('fs')
const path = require('path')
const alias = 'team'
const alias1 = 'prj1'

function removeFile () {
  const file = setupSrv.getConfigFileName()
  if (fs.existsSync(file)) { fs.unlinkSync(file) }
}

test('getConfigFileName', function () {
  expect(setupSrv.getConfigFileName()).toBe(path.join(homedir, 'meetnizer.config.json'))
})

test('isConfigured()', function () {
  removeFile()
  const config = setupSrv.isConfigured(homedir)
  expect(config).toBe(false)
})

test('createConfig()', function () {
  const dbPath = `${__dirname}`
  setupSrv.createDbFile(alias, dbPath)
  const config = setupSrv.getConfiguration()
  expect(config.dbFiles[0].collectionItem).toBe(path.join(dbPath, 'collection.item.db'))
  expect(config.dbFiles[0].collectionMeeting).toBe(path.join(dbPath, 'collection.meeting.db'))
  expect(config.timerDefault).toBe(5)
  removeFile()
})

test('saveConfig()', function () {
  const dbPath = path.join(__dirname, '/meeting1/')
  const dbPath1 = path.join(__dirname, '/meeting2/')
  setupSrv.createDbFile(alias, dbPath)

  var config = setupSrv.getConfiguration(homedir)

  setupSrv.createDbFile(alias1, dbPath1)

  config = setupSrv.getConfiguration(homedir)
  expect(config.dbFiles.length).toBe(2)
  expect(config.timerDefault).toBe(5)

  removeFile()
})

test('saveConfigDuplicated()', function () {
  const dbPath = path.join(__dirname, '/meeting1/')
  setupSrv.createDbFile(alias, dbPath)
  try {
    setupSrv.createDbFile(alias1, dbPath)
  } catch (err) {
    expect(err.message).toBe('configuration.dbfiles.path.exists')
  }

  removeFile()
})

test('emptyDbPath()', function () {
  const dbPath = ''
  setupSrv.createDbFile(alias, dbPath)
  try {
    setupSrv.createDbFile(alias1, dbPath)
  } catch (err) {
    expect(err.message).toBe('configuration.dbfiles.path.exists')
  }

  removeFile()
})

test('duplicateAlias()', function () {
  const dbPath = path.join(__dirname, '/meeting1/')
  const dbPath1 = path.join(__dirname, '/meeting2/')
  setupSrv.createDbFile(alias, dbPath)
  try {
    setupSrv.createDbFile(alias, dbPath1)
  } catch (err) {
    expect(err.message).toBe('configuration.dbfiles.alias.duplicated')
  }
  removeFile()
})

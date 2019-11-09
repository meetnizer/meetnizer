const { ipcMain } = require('electron')
const setupSrv = require('../../services/setup')
const meetingSrv = require('../../services/meeting')
const Util = require('./Util')
var Datastore = require('nedb')

let meetingAlias
let config
let meetingDb
let itemDb

module.exports = function () {
  ipcMain.on('setup.configCheck.message', (event, args) => {
    try {
      const userData = setupSrv.getHomeDir()
      const configured = setupSrv.isConfigured() && setupSrv.hasDbFiles()
      event.reply('setup.configCheck.reply', Util.Ok({ configured, userData }))
    } catch (err) {
      event.reply('setup.configCheck.reply', Util.Error({ err }))
    }
  })

  ipcMain.on('setup.config.message', (event, args) => {
    try {
      config = setupSrv.getConfiguration()
      event.reply('setup.config.message.reply', Util.Ok(config))
    } catch (err) {
      event.reply('setup.config.message.reply', Util.Error(err))
    }
  })

  ipcMain.on('setup.create.message', async (event, args) => {
    try {
      setupSrv.createDbFile(args.alias, args.dbPath)
      config = setupSrv.getConfiguration()
      for (const dbFile in config.dbFiles) {
        if (dbFile.alias === args.alias) {
          meetingDb = new Datastore({
            autoload: true,
            filename: dbFile.collectionMeeting
          })
          itemDb = new Datastore({
            autoload: true,
            filename: dbFile.collectionItem
          })
          await meetingSrv.newMeeting(meetingDb, dbFile.alias)
        }
      }
      if (!meetingDb || !itemDb) {
        throw new Error('database.initialization.failed')
      }
      event.reply('setup.create.reply', Util.Ok(config))
    } catch (err) {
      event.reply('setup.create.reply', Util.Error(err))
    }
  })

  ipcMain.on('meeting.setSelected', (event, args) => {
    meetingAlias = args.alias
  })

  console.log(meetingAlias)
}

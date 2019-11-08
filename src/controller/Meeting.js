const { ipcMain } = require('electron')
const setupSrv = require('../../services/setup')
const Util = require('./Util')
let meetingAlias

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
      event.reply('setup.config.message.reply', Util.Ok(setupSrv.getConfiguration()))
    } catch (err) {
      event.reply('setup.config.message.reply', Util.Error(err))
    }
  })

  ipcMain.on('setup.create.message', (event, args) => {
    try {
      setupSrv.createDbFile(args.alias, args.dbPath)
      const config = setupSrv.getConfiguration()
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

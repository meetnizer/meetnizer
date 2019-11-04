const { ipcMain } = require('electron')
const setupSrv = require('../../services/setup')
const userData = setupSrv.getHomeDir()

module.exports = function () {
  ipcMain.on('setup.configCheck.message', (event, args) => {
    const configured = setupSrv.isConfigured(userData)
    event.reply('setup.configCheck.reply', { configured, userData })
  })

  ipcMain.on('setup.config.message', (event, args) => {
    event.reply('setup.config.message.reply', setupSrv.getConfiguration())
  })

  ipcMain.on('setup.create.message', (event, args) => {
    try {
      setupSrv.createDbFile(args.alias, args.dbPath)
      const config = setupSrv.getConfiguration()
      event.reply('setup.create.reply', config)
    } catch (err) {
      event.reply('setup.create.reply', err)
    }
  })
}

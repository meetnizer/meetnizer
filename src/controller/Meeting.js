const { app, ipcMain } = require('electron')
const userData = app.getPath('userData')
const setupSrv = require('../../services/setup')

module.exports = function () {
  ipcMain.on('checkConfiguration.message', (event, args) => {
    const configured = setupSrv.isConfigured(userData)
    console.log(configured)
    event.reply('checkConfiguration.reply', { configured, userData })
  })

  ipcMain.on('setup.message', (event, args) => {
    setupSrv.createConfigFile(userData, args.pathToSave)
  })
}

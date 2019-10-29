const { app, ipcMain } = require('electron')
const setupSrv = require('../../services/setup')

module.exports = function () {
  ipcMain.on('test.message', (event, args) => {
    var configured = setupSrv.isConfigured(app.getPath('userData'))
    event.reply('test.reply', { configured })
  })
}

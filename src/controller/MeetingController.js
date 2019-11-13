const { ipcMain } = require('electron')
const setupSrv = require('../../services/setup')
const Util = require('../UtilMainProcess')
const meetingSrv = require('../../services/meeting')
var Datastore = require('nedb')

let config
let meetingDb
let itemDb
let selectedMeeting

function loadConfig (event) {
  try {
    const userData = setupSrv.getHomeDir()
    const configured = setupSrv.isConfigured()
    const hasDbFiles = setupSrv.hasDbFiles()
    if (configured) {
      config = setupSrv.getConfiguration()
    }
    event.reply('setup.configCheck.message.reply', Util.Ok({ configured, userData, hasDbFiles, config }))
  } catch (err) {
    event.reply('setup.configCheck.message.reply', Util.Error({ err }))
  }
}

function Events () {
  ipcMain.on('setup.configCheck.message', (event, args) => loadConfig(event))

  ipcMain.on('setup.create.workspace.message', (event, args) => {
    try {
      setupSrv.createDbFile(args.alias, args.dbPath)
      loadConfig(event)
    } catch (err) {
      event.reply('setup.create.workspace.message.reply', Util.Error(err))
    }
  })

  ipcMain.on('workspace.getmeetings.message', async (event, args) => {
    try {
      const meetings = await meetingSrv.getAllMeetings(meetingDb)
      event.reply('workspace.getmeetings.message.reply', Util.Ok(meetings))
    } catch (err) {
      event.reply('workspace.getmeetings.message.reply', Util.Error(err))
    }
  })

  ipcMain.on('workspace.selected.message', (event, args) => {
    try {
      const alias = args.workspaceAlias
      config.dbFiles.forEach(element => {
        if (element.alias === alias) {
          meetingDb = new Datastore({
            autoload: true,
            filename: element.collectionMeeting
          })
          itemDb = new Datastore({
            autoload: true,
            filename: element.collectionItem
          })
        }
      })
      if (!meetingDb || !itemDb) {
        throw new Error('impossible.to.create.datastore')
      }
      event.reply('workspace.selected.message.reply', Util.Ok({ workspaceAlias: alias }))
    } catch (err) {
      event.reply('workspace.selected.message.reply', Util.Error(err))
    }
  })

  ipcMain.on('meeting.create.message', async (event, args) => {
    try {
      selectedMeeting = await meetingSrv.newMeeting(meetingDb, args.name)
      event.reply('meeting.create.message.reply', Util.Ok({ meetingId: selectedMeeting._id }))
    } catch (err) {
      event.reply('meeting.create.message.reply', Util.Error(err))
    }
  })
}

module.exports = { Events }

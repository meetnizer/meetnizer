const { ipcMain } = require('electron')
// const moment = require('moment')
const setupSrv = require('../../services/setup')
const Util = require('../UtilMainProcess')
const meetingSrv = require('../../services/meeting')
const sessionSrv = require('../../services/session')
const itemSrv = require('../../services/item')
var Datastore = require('nedb')

let config
let meetingDb
let itemDb
let selectedMeeting
let selectedSession

async function getItemsForSession (event) {
  try {
    const items = await itemSrv.findAll(itemDb, selectedMeeting._id, selectedSession.date)
    event.reply('session.items.message.reply', Util.Ok({
      meetingName: selectedMeeting.name,
      items: items,
      durationInMinutes: selectedSession.durationInMinutes
    }))
  } catch (err) {
    event.reply('session.items.message.reply', Util.Error(err))
  }
}
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
      const meeting = await meetingSrv.newMeeting(meetingDb, args.name)
      event.reply('meeting.create.message.reply', Util.Ok({ id: meeting._id, name: meeting.name }))
    } catch (err) {
      event.reply('meeting.create.message.reply', Util.Error(err))
    }
  })

  ipcMain.on('meeting.session.message', async (event, args) => {
    try {
      selectedMeeting = await meetingSrv.findById(meetingDb, args.id)
      event.reply('meeting.session.message.reply', Util.Ok({ name: selectedMeeting.name, sessions: selectedMeeting.sessions }))
    } catch (err) {
      event.reply('meeting.session.message.reply', Util.Error(err))
    }
  })

  ipcMain.on('meeting.session.create.message', async (event, args) => {
    try {
      selectedMeeting = sessionSrv.addSession(selectedMeeting, args.name, args.date, args.duration)
      meetingSrv.saveMeeting(meetingDb, selectedMeeting)
      event.reply('meeting.session.message.reply', Util.Ok({ sessions: selectedMeeting.sessions }))
    } catch (err) {
      event.reply('meeting.session.create.message.reply', Util.Error(err))
    }
  })

  ipcMain.on('meeting.end.message', (event, args) => {
    meetingDb = undefined
    itemDb = undefined
    selectedMeeting = undefined
    selectedSession = undefined
  })

  ipcMain.on('session.items.message', (event, args) => {
    // selectedSession = sessionSrv.findByDate(selectedMeeting, moment(args.sessionDate, 'YYYY-MM-DD'))
    selectedSession = sessionSrv.findByDate(selectedMeeting, new Date(args.sessionDate))
    getItemsForSession(event)
  })

  ipcMain.on('session.item.create.message', async (event, args) => {
    try {
      await itemSrv.addItem(itemDb, selectedMeeting._id, selectedSession.date, args.name, args.owner, args.time, args.recurrent)
      getItemsForSession(event)
    } catch (err) {
      event.reply('session.item.create.message.reply', Util.Error(err))
    }
  })
  /*
  ipcMain.on('meeting.session.delete.message', async (event, args) => {
    console.log(args.date, args.meetingId)
  })
  */
  ipcMain.on('session.item.message', async (event, args) => {
    const id = args._id
    const action = args.action
    const status = args.status
    switch (action) {
      case 'moveup':
        await itemSrv.changeOrder(itemDb, selectedMeeting._id, selectedSession.date, id, true)
        getItemsForSession(event)
        break
      case 'movedown':
        await itemSrv.changeOrder(itemDb, selectedMeeting._id, selectedSession.date, id, false)
        getItemsForSession(event)
        break
      case 'remove':
        await itemSrv.remove(itemDb, id)
        getItemsForSession(event)
        break
      case 'done':
        await itemSrv.changeStatus(itemDb, id, status)
        getItemsForSession(event)
        break
    }
  })

  ipcMain.on('session.start.message', async (event, args) => {
    event.reply('session.start.message.reply', args)
  })
}

module.exports = { Events }

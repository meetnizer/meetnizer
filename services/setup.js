const fs = require('fs')
const path = require('path')
const homedir = require('os').homedir()
// var configDir = path.join(homedir, 'timet.json')
function isConfigured () {
  return fs.existsSync(getConfigFileName())
}

function getConfiguration () {
  return JSON.parse(fs.readFileSync(getConfigFileName()))
}

function getConfigFileName () {
  return path.join(homedir, 'settings.json')
}
function getDbFilesNames (dbFilePath) {
  const colMeeting = path.join(dbFilePath, 'collection.meeting.db')
  const colItem = path.join(dbFilePath, 'collection.item.db')

  return { collectionMeeting: colMeeting, collectionItem: colItem }
}

function createDbFile (dbFilePath) {
  let config

  if (!isConfigured()) {
    config = {
      dbFiles: [getDbFilesNames(dbFilePath)],
      timerDefault: 5
    }
  } else {
    config = getConfiguration()
    config.dbFiles.map(item => {
      if (item.collectionMeeting.indexOf(dbFilePath) >= 0 ||
          item.collectionItem.indexOf(dbFilePath) >= 0) {
        throw new Error('configuration.dbfiles.path.exists')
      }
    })

    config.dbFiles.push(getDbFilesNames(dbFilePath))
  }

  fs.writeFileSync(
    getConfigFileName(),
    JSON.stringify(config, null, 4)
  )
}

module.exports =
  {
    isConfigured,
    getConfiguration,
    getConfigFileName,
    createDbFile
  }

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
function getDbFilesNames (alias, dbFilePath) {
  const colMeeting = path.join(dbFilePath, 'collection.meeting.db')
  const colItem = path.join(dbFilePath, 'collection.item.db')

  return { alias: alias, collectionMeeting: colMeeting, collectionItem: colItem }
}

function createDbFile (alias, dbFilePath) {
  let config

  if (!isConfigured()) {
    config = {
      dbFiles: [getDbFilesNames(alias, dbFilePath)],
      timerDefault: 5
    }
  } else {
    config = getConfiguration()
    config.dbFiles.map(item => {
      console.log(item.alias, alias)
      if (item.alias === alias) {
        throw new Error('configuration.dbfiles.alias.duplicated')
      }
      if (item.collectionMeeting.indexOf(dbFilePath) >= 0 ||
          item.collectionItem.indexOf(dbFilePath) >= 0) {
        throw new Error('configuration.dbfiles.path.exists')
      }
    })

    config.dbFiles.push(getDbFilesNames(alias, dbFilePath))
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

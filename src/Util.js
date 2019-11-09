const { remote } = window.require('electron')

function showError (data) {
  remote.dialog.showErrorBox('Internal Error', JSON.stringify(data.data))
}

module.exports = showError

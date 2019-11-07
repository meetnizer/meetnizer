const { dialog } = window.require('electron')

function showError (data) {
  dialog.showErrorBox('Internal Error', JSON.stringify(data.data))
}

module.exports = showError

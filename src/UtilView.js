import moment from 'moment'
const { remote } = window.require('electron')

function showError (data) {
  remote.dialog.showErrorBox('Internal Error', JSON.stringify(data.errorMessage))
}

function formatDateToShow (date) {
  return moment(date).format('DD/MM/YYYY')
}

function formatDate (date) {
  return moment(date).format('YYYY-MM-DD')
}

module.exports =
{
  showError,
  formatDateToShow,
  formatDate
}

// import moment from 'moment'

function isValidDate (date) {
  return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date)
}

function convertDateToDB (date) {
  if (isValidDate(date)) {
    return Number(date)
  }
  throw new Error('invalid.date.conversion', date)
}

module.exports =
  {
    isValidDate,
    convertDateToDB
  }

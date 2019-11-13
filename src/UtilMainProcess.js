function Ok (data) {
  return { error: false, data: data }
}

function Error (err) {
  return { error: true, errorMessage: err.message, lineNumber: err.lineNumber, fileName: err.fileName }
}

module.exports = {
  Ok,
  Error
}

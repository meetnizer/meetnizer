function Ok (data) {
  return { error: false, data: data }
}

function Error (err) {
  const msg = { error: true, errorMessage: err.message, lineNumber: err.lineNumber, fileName: err.fileName }
  return msg
}

module.exports = {
  Ok,
  Error
}

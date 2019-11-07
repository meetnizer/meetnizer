function Ok (data) {
  return { error: false, data: data }
}

function Error (data) {
  return { error: true, data: data }
}

module.exports = {
  Ok,
  Error
}

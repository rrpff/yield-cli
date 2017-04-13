exports.print = function print (value) {
  return { command: 'PRINT', value }
}

exports.ask = function ask (question) {
  return { command: 'ASK', question }
}

exports.askHidden = function askHidden (question) {
  return { command: 'ASK_HIDDEN', question }
}

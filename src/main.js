const run = require('./run')
const processors = require('./processors')

function main ({ commands }) {
  const command = process.argv.slice(2).join(' ')
  run(command, { commands, processors })
}

module.exports = main

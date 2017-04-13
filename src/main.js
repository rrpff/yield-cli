const run = require('./run')
const processors = require('./processors')

function main ({ commands }) {
  run(process.argv.slice(2), { commands, processors })
}

module.exports = main

const parseArgs = require('minimist')

const COMMAND_NOT_FOUND_ERROR = command => `"${command}" is not a command.`

function run (commandText, { commands = {}, processors = {} } = {}) {
  const chunks = commandText.split(' ')
  const argv = parseArgs(chunks)
  const [commandName, ...params] = argv._
  const command = commands[commandName]

  if (!command) throw new Error(COMMAND_NOT_FOUND_ERROR(commandName))

  command({ userFlags: argv, userParams: params, processors })
}

module.exports = run

const parseArgs = require('minimist')

const GENERATOR = (function*(){}).constructor
const COMMAND_NOT_FOUND_ERROR = command => `Error: "${command}" is not a command.`

// const commandHandlers = {
//   'PRINT' (command) {
//     console.log(command.value)
//   }
// }

function runCommand (commandObject, processors) {
  if (!commandObject) return

  const handler = processors[commandObject.command]
  handler(commandObject)
}

function processGenerator (processors, generator, input) {
  const { value, done } = generator.next(input)
  const nextInput = runCommand(value, processors)

  if (!done) processGenerator(processors, generator, nextInput)
}

function command ({ flags = {}, handler }) {
  return function ({ userFlags, userParams, processors }) {
    const mergedFlags = Object.assign({}, flags, userFlags)
    const generator = handler(userParams, mergedFlags)

    if (!(handler instanceof GENERATOR)) return
    processGenerator(processors, generator)
  }
}

function run (commandText, { commands = {}, processors = {} } = {}) {
  const chunks = commandText.split(' ')
  const argv = parseArgs(chunks)
  const [commandName, ...params] = argv._
  const command = commands[commandName]

  if (!command) throw new Error(COMMAND_NOT_FOUND_ERROR(commandName))

  command({ userFlags: argv, userParams: params, processors })
}

function print (value) {
  return { command: 'PRINT', value }
}

exports.command = command
exports.run = run
exports.print = print

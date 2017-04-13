const COMMAND_UNDEFINED_ERROR = command => `There is no command called ${command}`
const GENERATOR = (function*(){}).constructor

function runCommand (commandObject, processors) {
  return new Promise((accept, reject) => {
    if (!commandObject) return accept()

    const { command } = commandObject
    const handler = processors[command]
    if (!handler) return reject(new Error(COMMAND_UNDEFINED_ERROR(command)))

    accept(handler(commandObject))
  })
}

function processGenerator (processors, generator, input) {
  const { value, done } = generator.next(input)

  runCommand(value, processors).then(nextInput => {
    if (!done) processGenerator(processors, generator, nextInput)
  })
}

function command ({ flags = {}, handler }) {
  return function ({ userFlags, userParams, processors }) {
    const mergedFlags = Object.assign({}, flags, userFlags)
    const generator = handler(userParams, mergedFlags)

    if (!(handler instanceof GENERATOR)) return
    processGenerator(processors, generator)
  }
}

module.exports = command

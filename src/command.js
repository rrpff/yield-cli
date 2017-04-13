const GENERATOR = (function*(){}).constructor

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

module.exports = command

const readline = require('readline')

exports['PRINT'] = function (command) {
  process.stdout.write(command.value)
}

exports['ASK'] = function (command) {
  return new Promise(accept => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question(`${command.question} `, value => accept(value))
  })
}

exports['ASK_HIDDEN'] = function (command) {
  return new Promise(accept => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const stdin = process.openStdin()

    process.stdin.on("data", chunk => {
      switch (chunk.toString()) {
        case "\n":
        case "\r":
        case "\u0004":
          stdin.pause()
          break
        default:
          process.stdout.write(`${parseInt('033', 8)}[2K${parseInt('033', 8)}[200D${command.question} `)
        break
      }
    })

    rl.question(`${command.question} `, value => {
      rl.history = rl.history.slice(1)
      accept(value)
    })
  })
}

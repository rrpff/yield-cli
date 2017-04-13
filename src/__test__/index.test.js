const { run, command, print, ask } = require('../')

test('reads options', () => {
  const help = command({
    name: 'help',
    flags: { verbose: false },
    handler ([name]) {
      expect(name).toEqual('thing')
    }
  })

  run('help thing', { commands: { help } })
})

test('reads flags', () => {
  const help = command({
    name: 'help',
    flags: { verbose: false },
    handler ([name], { verbose }) {
      expect(verbose).toEqual(true)
    }
  })

  run('help thing --verbose', { commands: { help } })
})

test('sets defaults for flags', () => {
  const help = command({
    name: 'help',
    flags: { verbose: false },
    handler (options, { verbose }) {
      expect(verbose).toEqual(false)
    }
  })

  run('help thing', { commands: { help } })
})

test('supports yielding to commands which pass input back in', () => {
  const login = command({
    name: 'login',
    *handler () {
      const username = yield ask('What is your username?')
      const password = yield ask('What is your password?', { hidden: true })

      expect(username).toEqual('tester')
      expect(password).toEqual('monkey')

      yield print('Login successful')
    }
  })

  const askSpy = function (command) {
    if (command.question === 'What is your username?') return 'tester'
    if (command.question === 'What is your password?') return 'monkey'
  }

  const printSpy = function (command) {
    expect(command.value).toEqual('Login successful')
  }

  run('login', {
    commands: { login },
    processors: { 'ASK': askSpy, 'PRINT': printSpy }
  })
})

test('fails when the command does not exist', () => {
  expect(run.bind(run, 'whatever')).toThrow('"whatever" is not a command.')
})

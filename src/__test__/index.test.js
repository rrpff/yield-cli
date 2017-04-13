const { run, command, print, ask, hidden } = require('../')

test('reads options', () => {
  expect.assertions(1)

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
  expect.assertions(1)

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
  expect.assertions(1)

  const help = command({
    name: 'help',
    flags: { verbose: false },
    handler (options, { verbose }) {
      expect(verbose).toEqual(false)
    }
  })

  run('help thing', { commands: { help } })
})

test('prints out data', () => {
  expect.assertions(1)

  const whatever = command({
    name: 'whatever',
    *handler () {
      yield print('This is a test')
    }
  })

  const printSpy = command => expect(command.value).toEqual('This is a test')

  run('whatever', {
    commands: { whatever },
    processors: { 'PRINT': printSpy }
  })
})

// test('asks questions', () => {
//   expect.assertions(2)
//
//   const login = command({
//     name: 'login',
//     *handler () {
//       const username = yield ask('What is your username?')
//       const password = yield hidden('What is your password?')
//
//       expect(username).toEqual('tester')
//       expect(password).toEqual('monkey')
//     }
//   })
//
//   run('login', { commands: { login } })
// })

test('fails when the command does not exist', () => {
  expect(run.bind(run, 'whatever')).toThrow('Error: "whatever" is not a command.')
})

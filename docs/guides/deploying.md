A command is an instance of the `seeli.Command` class. Its only requirement is
that it has a function named `run` that returns a promise. What the function does is up to you.

```javascript
const seeli = require('seeli')
const command = new seeli.Command({
  run: asnyc() => {
    return 'hello world'
  }
});
```

## Configuring Seeli

Seeli has a simple configuration system exposed as top level functions
* `seeli.get`: get the value of a configuration property
* `seeli.set`: set the value of a configuration property

```javascript
'use strict'

const seeli = require('seeli')
seeli.set('exitOnError', true)
```

There are a few global options you can manipulate to change basic behaviors
of seeli

* `help`: Absolute path to a command to use for the help command. You can use the to use your own help command.
* `exitOnError`: If an error is encountered, seeli will try to forcefully exit
* `exitOnContent`: When a command successfully completes and returns, seeli will try to forcefully exit
* `color`: The primary accent color (default `green`). The is used by the default
  `help` command output and ing the convenience command `colorize`

```javascript

'use strict'

const seeli = require('seeli')
seeli.set('color', 'red')

console.log(seeli.colorize('this is red'))
```

## Executing Commands

There a two ways a command can be executed.

1. Manually call the `run` function
2. Registered with seeli and invoked via terminal

# Command Output

You can return anything from the `run` function of a command. Seeli will automatically
print string output from registered commands to `stdout`


```javascript
const seeli = require('seeli')
const command = new seeli.Command({
  run: asnyc () => {
    return 'hello world'
  }
});

command.run().then(console.log)
// hello world
```

## Registering Commands

Interacting with commands programmatically can be good for testing and
command chaining. More often than not you will want to execute commands based
on input from a terminal. To do that, you register commands with seeli
using the `use` command.


```javascript
// cli.js
'use strict'

const seeli = require('seeli')

const hello = new seeli.Command({
  run: async () => {
    return 'hello'
  }
})

const goodbye = new seeli.Command({
  run: async () => {
    return 'good bye'
  }
})

seeli.use('hello', hello)
seeli.use('goodbye', goodbye)

seeli.run()
```

```bash
$ cli hello
# hello

$ cli goodbye
# good bye
```

## Naming Commands

Commands can be named explicitly when they are registered with `seeli.use`.
Alternatively, a comand can specify a `name` property and an explicit name
can be omitted when registering

```javascript
'use strict'
const seeli = require('seeli')

const hello = new seeli.Command({
  run: async () => {
    return 'hello'
  }
})

const goodbye = new seeli.Command({
  name: 'goodbye'
  run: async () => {
    return 'good bye'
  }
})

// explicit naming
seeli.use('hello', hello)

// implicit naming
seeli.use(goodbye)
```

### Aliasing Commands

All commands are given a set of short hand alias names based on the name of the command.
These shorthands are generated using the [abbrev package](https://www.npmjs.com/package/abbrev).
Additionally, each command can specify an array of alias names using the `alias` option

```javascript
'use strict'
const seeli = require('seeli')
const help = new seeli.Command({
  name: 'help'
, alias: ['hlep']
, run: async () => {}
})
seeli.use(help)
```

The above command can be invoked with the following names `h`, `he`, `hel`, `help`, or `hlep`

## Deployment

### Directory Structure

```
├── bin
│   ├── cli.js
│   └── commands
│       ├── index.js
│       ├── one.js
│       ├── three.js
│       └── two.js
├── index.js
├── lib
│   └── index.js
└── package.json
```

### package.json

```json
{
  "bin": {
    "mycli": "./bin/cli.js"
  }
}
```

### Entrypoint

You entry point script will need too register all of your commands and execute seeli.

```javascript
// bin/cli.js
'use strict'

const seeli = require('seeli')
const commands = require('./bin/commands')

seeli.set('name', 'mycli')
seeli.set('color', 'blue')

for (const command of Object.values(commands)) {
  seeli.use(command)
}

seeli.run()
```

### Installation

Your command line to can be installed from your project locally with `npm link`.
Or it can be installed globally with your package using the `-g` flag of npm `install`
With this configuration, it will be available as `mycli`

```bash
$ npm link .
$ mycli
```
or
```bash
$ npm install my-project -g
$ mycli
```



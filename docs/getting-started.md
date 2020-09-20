# Getting Started

## Installation

```bash
$ npm install seeli
```

## Running Seeli

Seeli has a `run` function that reads any arguments and flags from terminal input
and either executes the appropriate command, or displays help messages.

```javascript
'use strict'
var seeli = require('seeli')
seeli.run()
```

```shell
$ node ./cli
Usage:  seeli <command> [options]

Where <command> is the name the command to execute
*  help - displays information about available commands
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
* `exitOnError`: If an error is encountered, seeli will try to forcefully exit. (default `true`)
* `exitOnContent`: When a command successfully completes and returns, seeli will try to forcefully exit. (default `true`)
* `color`: The primary accent color (default `green`). The is used by the default
  `help` command to generate usage output and the convenience function `colorize`

```javascript
'use strict'

const seeli = require('seeli')
seeli.set('color', 'red')

console.log(seeli.colorize('this is red'))
```
## Commands

A command is an instance of the `seeli.Command` class. Its only requirement is
that it has a function named `run` that returns a promise. What the function does is up to you.


### Executing Commands

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

### Registering Commands

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

```shell
$ cli hello
# hello

$ cli goodbye
# good bye
```

### Naming Commands

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

### Help Command

Seeli ships with a single command - [help](https://github.com/esatterwhite/node-seeli/blob/master/lib/commands/help.js) it can be envoked like a command
or by using the `--help` flag.

The following invocations all invoke the help command. The first will
list all available commands. The last two invoke the help command
specifically for the `command` command.

```shell
$ cli help
$ cli help command
$ cli command --help
```


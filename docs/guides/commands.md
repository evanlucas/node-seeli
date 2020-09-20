# Commands

An instance of the `command` class represents a single executable unit.
The seeli framework parses user input and executes the appopriate command.
Commands handle basic validation, formatting help messages, prompting for
user input. The vast majority of this functionality is handled through **flags**

## Flags

A flag represents a single value that you want to collect from user input.
When the command sucessfully executes, the collected values are passed to
the `run` function of your command as a single object.

A simple example would be collecting name and age of an individual


```javascript
const {Command} = require('seeli')

module.exports = new Command({
  name: 'personalize'
, flags: {
    name: {
      type: String
    , description: 'Your name'
    , shorthand: 'n'
    }
  , age: {
      type: Number
    , description: 'Your age in years'
    , shorthand: 'a'
    }
  }
, run: async function(command, data) {
    console.log(data.name)
    console.log(data.age)
  }
})
```
### Options

name | required | type | description
-----|:--------:|:----:|------------
**type** |  `true` | `string` |The type of input that is expected. Boolean types to not expect input. The present of the flag **implies** `true`. Additionally, boolean flags allow for `--no-<flag>` to enforce `false`. If you want to accept multiple **values**, you specify type as an array with the first value being the type you which to accept. For example `[String, Array]` means you will accept multiple string values.|
**description** | `false` | `string` |  a description of the flag in question. Used to generate help messages |
**required** | `false` | `boolean` |  If set to `true` a `RequiredFieldError` will be emitted  |
**shorthand**  | `false` | `string` | An optional shorthand name that will be expanded out to the long hand flag. |
**interactive** | `false` | `boolean` | If set to false the flag will omitted from interactive prompts
**default**    | `false` | `mixed` | A value to return if the flag is omitted. |
**mask**       | `false` | `boolean` | **interactive mode only** Sets the input type to masked input to hide values
**choices**    | `false` | `array` | Used only during an interactive command. Restricts the users options only to the options **specified** |
**multi**      | `false` | `boolean` | **interactive mode only** If choices is specified, and multi is true, this user will be presented a multi checkbox UI allowing them to pick multiple values. The return value will be an array
**skip**       | `false` | `boolean` | **interactive mode only** - if set to `true` this flag will be omitted from the interactive command prompts |
**event**      | `false` | `boolean` | if set to `true` the command will emit an event withe the same name as the flag with **the** value that was captured for that flag |
**when** | `false` | `function` | **interactive mode only** Receives the current user answers hash and should return true or **false** depending on whether or not this question should be asked.
**validate** | `false` | `function` |  receives user input and should return true if the value is **valid**, and an error message (String) otherwise. If false is returned, a default error message is provided.
**filter** | `false` | `function` | **interactive mode only** Receives the user input and return the filtered value to be used **inside** the program. The value returned will be added to the Answers hash.

### Types

Generally, all input from `stdin` is represented as strings. Using the flag `type` option you can specify
The data expected data type and the input value will be coerced appropriately.
In most cases, you may pass the native javascript type you want to use. There are special cases
for `url` and `path`

#### String

Coerce all values as text / strings

#### Number

Coerce all values as numeric ( integer or decimal )

#### Date

Converts javascript date string into full Date objects

#### Boolean

Boolean is a special input type in that it doesn't require an input value. The presence of the flag indicates a true value.
The flag can be negated by prefixing the flag with `no-`

```javascript
new Command({
  flags: {
    bool: {
      type: Boolean
    }
  }
})
```

```sh
$ cmd --bool #true
$ cmd --no-bool #false
```
#### URL

A valid URL string. If it can't be parsed or is not a value url, An error will be raised.
The flag type should be the node `url` module

```javascript
const url = require('url')

new Command({
  flags: {
    website: {
      type: url
    }
  }
})
```


#### Path

A valid file system path. If the path doesn't resolve, an error will be raised.

```javascript
const path = require('path')

new Command({
  flags: {
    file: {
      type: path
    }
  }
})
```

#### Password

Collects values as strings, but does not display the input value when it is typed.

#### Array

Including `Array` in combination with another type allows a particular flag to be repeated.
The resulting input value will always be an array

```javascript
new Command({
  flags: {
    numbers: {
      type: [Number, Array]
    }
  }
})
```

```sh
$ cmd --numbers=1 --numbers=2 --numbers=3
# {numbers: [1, 2, 3]}
```

### Nested Flags

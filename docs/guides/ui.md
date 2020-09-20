# UI

As your commands become more complex and do more things, the need to communicate what is happening
to users becomes increasingly important. Seeli provides a few simple and powerful ways
to interact and communicate with users.

## Progress Indicators

Seeli commands have access to an instance of [ora](https://www.npmjs.com/package/ora) inside the `run` function.
It can be controlled by the `ui` property. Additionally, you may use `ui` configuration
property to change the progress spinner to any valid ora spinner.


```javascript{12}
const seeli = require('seeli')

const sleep = (ms =100) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const UI = new seeli.Command({
  name: 'progress'
, description: 'Displays a progress indicator'
, ui: 'bouncingBar'
, run: async function (cmd, data) {
    this.ui.start('processing...')
    await sleep(2000)
    this.ui.succeed('done')
  }
})

seeli.use(UI)
seeli.run()
```

![progress](../assets/img/guides/ui-progress.gif)

All available spinners
![spinners](../assets/img/guides/ui-spinners.gif)


## Messages

By assigning a string to the `text` property of the **ui** instance
you are able to set the text of the terminal in place. This is useful for
updating users of the current status. For example, you may want to
display the number of steps that have been completed by the current command.

```javascript{11}
const seeli = require('seeli')

const messages = new seeli.Command({
  name: 'messages'
, description: 'Displays random messages'
, run: async function(cmd, data) {
    let x = 10
    this.ui.start('processing...')
    while (x--) {
      await sleep(1000)
      this.ui.text = randomMessage()
    }
    this.ui.succeed('done')
  }
})

seeli.use(messages)
seeli.run()
```
![messages](../assets/img/guides/ui-messages.gif)

## Alerts

When you need to display important messages, like a command failing or
prematurely stopping, you should use the alert functions. each function has
a unique icon for the severity of the message. The functions available on the
`ui` object are:

* **info**
* **warn**
* **fail**
* **succeed**

```javascript
const seeli = require('seeli')

const alerts = new seeli.Command({
  name: 'alerts'
, description: 'Displays a progress indicator'
, run: async function(cmd, data) {
    this.ui.start('rendering alerts')
    await sleep(1000)
    this.ui.info('info')
    await sleep(1000)
    this.ui.warn('warn')
    await sleep(1000)
    this.ui.fail('fail')
    await sleep(1000)
    this.ui.succeed('success')
  }
})
seeli.use(alerts)
seeli.run()
```

::: tip
When you use one of the alery function, the progress indicator will be stopped.
You must call `this.ui.start(...)` again to restart it
:::
![alerts](../assets/img/guides/ui-alerts.gif)

## Prompts

Seeli uses the [inquirer](https://www.npmjs.com/package/inquirer) to interactively collect input
from users. This functionality is exposed via the `prompt` function.
This is a direct passthrough the the inquirer function of the [same name](https://www.npmjs.com/package/inquirer#inquirerpromptquestions---promise).
This makes things like conditional and branching logic based on user input
significantly easier.

<<< @/docs/examples/commands/prompts.js{14-18}
![prompts](../assets/img/guides/ui-prompts.gif)

module.exports = function (RED) {
  function WebPushNotificationNode (n) {
    RED.nodes.createNode(this, n)

    this.content = n

    var node = this

    this.on('input', (msg) => {
      let payload = {}

      node.status({})

      try {
        if (node.content.title) {
          if (!payload.notification) {
            payload.notification = {}
          }
          payload.notification.title = node.content.title
        }

        if (node.content.body) {
          if (!payload.notification) {
            payload.notification = {}
          }
          payload.notification.body = node.content.body
        }

        if (node.content.sound) {
          if (!payload.notification) {
            payload.notification = {}
          }
          payload.notification.sound = node.content.sound
        }

        if (node.content.payload) {
          let data = {}
          let keyValArray = JSON.parse(node.content.payload)
          for (let i = 0; i < keyValArray.length; i++) {
            switch (keyValArray[i].type) {
              case 'str':
                var value = String(keyValArray[i].value)
                data[keyValArray[i].key] = value
                break
              case 'num':
                var value = parseFloat(keyValArray[i].value)
                if (!Number.isNaN(value)) {
                  data[keyValArray[i].key] = value
                } else {
                  throw new Error('Could not parse ' + keyValArray[i].value + ' into a number.')
                }
                break
              case 'bool':
                var value = keyValArray[i].value == true
                data[keyValArray[i].key] = value
                break
              case 'json':
                var value = JSON.parse(keyValArray[i].value)
                data[keyValArray[i].key] = value
                break
            }
          }
          payload.data = data
        }

        msg.notification = payload

        node.send(msg)
      } catch (err) {
        node.status({ fill: 'red', shape: 'dot', text: err.message })
      }
    })

    this.on('close', () => {
      node.status({})
    })
  }
  RED.nodes.registerType('web-push-notification', WebPushNotificationNode)
}

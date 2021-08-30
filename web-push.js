module.exports = function (RED) {
  function WebPushNode (n) {
    RED.nodes.createNode(this, n)
    var node = this

    this.vapidConfiguration = RED.nodes.getNode(n.vapidConfiguration)

    this.on('input', msg => {
      try {
        node.status({ fill: 'blue', shape: 'dot', text: ' ' })

        let payload
        if ((msg.notification != null) && (typeof msg.notification === 'object')) {
          payload = JSON.stringify(msg.notification)
        }

        let options
        if (node.vapidConfiguration) {
          options = {
            vapidDetails: {
              subject: node.vapidConfiguration.subject,
              publicKey: node.vapidConfiguration.publicKey,
              privateKey: node.vapidConfiguration.privateKey
            }
          }

          if (node.vapidConfiguration.gcmApiKey) {
            options['gcmAPIKey'] = node.vapidConfiguration.gcmApiKey
          }
          
          // Only apply the timeout when it is specified and greater than zero
          if (node.vapidConfiguration.timeout && node.vapidConfiguration.timeout > 0) {
            options['timeout'] = node.vapidConfiguration.timeout
          }
        }

        if (msg.subscriptions && msg.subscriptions.length > 0) {
          const webPush = require('web-push')

          function sendNotification (subscription, payload, options) {
            return new Promise((resolve, reject) => {
              webPush.sendNotification(subscription, payload, options).then(response => {
                resolve({
                  sent: {
                    endpoint: subscription.endpoint
                  }
                })
              }).catch((err) => {
                // When a standard error text has been received, make sure it is converted to mimic a WebPushError object.
                // Otherwise it has no 'failed' property, so it will be considered no failure further on ...
                if (err instanceof Error) {
                  err = {
                    failed: {
                      name: err.name,
                      message: "Standard exception",
                      body: err.message
                    }
                  }
                }
                
                // Remove some properties from the WebPushError to make sure the logs only contain useful information
                delete err.failed.headers
                delete err.failed.endpoint

                // Log the error message to simplify troubleshooting
                node.error(JSON.stringify(err.failed))

                resolve({
                  failed: JSON.parse(JSON.stringify(err))
                })
              })
            })
          }

          let promises = []

          for (let i = 0; i < msg.subscriptions.length; i++) {
            promises.push(sendNotification(msg.subscriptions[i], payload, options))
          }

          Promise.all(promises).then(results => {
            msg.payload = {
              sent: results.reduce((prev, current) => {
                if (current.sent) {
                  prev.push(current.sent)
                }
                return prev
              }, []),
              failed: results.reduce((prev, current) => {
                if (current.failed) {
                  prev.push(current.failed)
                }
                return prev
              }, [])
            }
            node.status({
              fill: 'green',
              shape: 'dot',
              text: msg.payload.sent.length + ' sent, ' + msg.payload.failed.length + ' failed.'
            })
            node.send(msg)
          })
        } else {
          throw new Error('Missing subscriptions')
        }
      } catch (err) {
        node.status({ fill: 'red', shape: 'dot', text: err.message })
        node.error(err)
        return
      }
    })

    this.on('close', () => {
      node.status({})
    })
  }
  RED.nodes.registerType('web-push', WebPushNode)
}

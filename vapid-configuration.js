module.exports = function (RED) {
  function VapidConfigurationNode (config) {
    RED.nodes.createNode(this, config)
    this.subject = config.subject
    this.publicKey = config.publicKey
    this.privateKey = config.privateKey
    this.gcmApiKey = config.gcmApiKey
  }
  RED.nodes.registerType('vapid-configuration', VapidConfigurationNode)
}

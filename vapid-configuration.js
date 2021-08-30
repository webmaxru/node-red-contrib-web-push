module.exports = function (RED) {
  const webpush = require('web-push');
    
  function VapidConfigurationNode (config) {
    RED.nodes.createNode(this, config)
    this.subject = config.subject
    this.publicKey = config.publicKey
    this.privateKey = config.privateKey
    this.gcmApiKey = config.gcmApiKey
    this.timeout = config.timeout
    
    // Older nodes (version 0.0.3 and below) have no timeout option, so set it to 0 (= no custom timeout)
    if (this.timeout == undefined) {
      this.timeout = 0;
    }
  }
  RED.nodes.registerType('vapid-configuration', VapidConfigurationNode)
  
  // Make the key pair generation available to the config screen (in the flow editor)
  RED.httpAdmin.get('/vapid_configuration/generate_key_pair', RED.auth.needsPermission('vapid-configuration.write'), async function(req, res){
    try {
      // Generate a VAPID keypair
      const vapidKeys = webpush.generateVAPIDKeys();
 
      // Return public key and private key to the config screen (since they need to be stored in the node's credentials)
      res.json({
        publicKey: vapidKeys.publicKey,
        privateKey: vapidKeys.privateKey
      })
    }
    catch (err) {
      console.log("Error while generating VAPID keypair: " + err)
      res.status(500).json({error: 'Error while generating VAPID keypair'})
    }
  });
}

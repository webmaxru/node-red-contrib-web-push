module.exports = function (RED) {
  const webpush = require('web-push');
    
  function VapidConfigurationNode (config) {
    RED.nodes.createNode(this, config)
    this.subject = config.subject
    // Keep the old key fields, to support old nodes (without credentials)
    this.publicKey = config.publicKey
    this.privateKey = config.privateKey
    this.gcmApiKey = config.gcmApiKey
    
    var node = this;
    
    // Allow other nodes to access the secure node private credentials.
    // This is not good practice, but don't see a better approach since these nodes were designed originally without credentials ...
    this.getKeys = function () {
        // Use the new keys in the credentials, unless we are dealing with an old node (without credentials)
        return {
            publicKey : node.credentials.publicKey2  || node.publicKey,
            privateKey: node.credentials.privateKey2 || node.privateKey,
            gcmApiKey : node.credentials.gcmApiKey2  || node.gcmApiKey
        }
    }
  }
  
  RED.nodes.registerType("vapid-configuration", VapidConfigurationNode,{
    credentials: {
      publicKey2: {type: "password"},
      privateKey2: {type: "password"},
      gcmApiKey2: {type: "password"}
    }
  });
  
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

Node-RED Web Push Notification nodes
====================================

`node-red-contrib-web-push` is a [Node-RED](http://nodered.org/) package that allows your Progressive Web Applications to send Web Push notifications using the standard [Web Push Protocol](https://tools.ietf.org/html/draft-ietf-webpush-protocol), while sender authentication can be achieved by implementing [VAPID](https://tools.ietf.org/html/draft-thomson-webpush-vapid). It uses the [web-push](https://github.com/web-push-libs/web-push).

The ```web push``` node is used to send notifications to Chrome, Firefox, Opera, Edge and Samsung Internet browsers. For a list of supported versions of those browsers, check the [web-push](https://github.com/web-push-libs/web-push) page.

Chrome prior 52 and some other old browsers require a GCM Api Key to send notifications, so you will need to configure it in the node.

You can use the ```web-push-notification``` node to set the properties of a notification, or you can send the values in the ```msg.notification``` object.

The device tokens must be provided in the ```msg.subscriptions``` object and they must contain the ```endpoint```, as well as the ```p256dh``` and the ```auth``` keys.

More information available in the ```web``` node info tab.

The ```web``` nodes returns the result in the ```msg.payload``` key.

## Sample flow

You can find an sample flow in ```demo-flow.json```. It contains a simple API to manage the subscriptions and store them in a Flow variable. You can use [PWAtter](https://github.com/webmaxru/pwatter) demo project as a client-side PWA.

## Demo

![Demo GIF](/demo.gif?raw=true "Demo GIF")

## License

Copyright 2018 <a href="https://twitter.com/webmaxru/">Maxim Salnikov</a>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

### Credits
This node is based on <a href="https://github.com/Xzya/node-red-contrib-push/" target="_new">node-red-contrib-push</a> by <a href="https://github.com/Xzya/">Mihail Cristian Dumitru</a>.
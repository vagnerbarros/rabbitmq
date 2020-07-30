const amqp = require('amqplib/callback_api');

amqp.connect('amqp://username:password@localhost/demo_virtual_host', function(connectionError, connection) {
  if(connectionError){
    throw connectionError;
  }

  connection.createChannel(function(channelError, channel){
    if(channelError){
      throw channelError;
    }

    let queue = 'hello';
  
    channel.assertQueue(queue, {
      durable: false
    });
  
    channel.consume(queue, function(msg){
      console.log(`Received ${msg.content.toString()}`);
    }, {
      noAck: true
    });
  });
});
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
    let msg = 'hello world';
  
    channel.assertQueue(queue, {
      durable: false
    });
  
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(`Sent ${msg}`);
  
    setTimeout(function(){
      connection.close();
      process.exit(0);
    }, 500);
  });
});
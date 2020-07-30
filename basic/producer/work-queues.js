const amqp = require('amqplib/callback_api');

amqp.connect('amqp://username:password@localhost/demo_virtual_host', function(connectionError, connection) {
  if(connectionError){
    throw connectionError;
  }

  connection.createChannel(function(channelError, channel){
    if(channelError){
      throw channelError;
    }

    let queue = 'task_queue';
    let msg = process.argv.slice(2).join(' ') || "Hello World";
  
    channel.assertQueue(queue, {
      durable: true
    });
  
    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true
    });
    console.log(`Sent ${msg}`);
  
    setTimeout(function(){
      connection.close();
      process.exit(0);
    }, 500);
  });
});
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
  
    channel.assertQueue(queue, {
      durable: true
    });
    channel.prefetch(1);
  
    channel.consume(queue, function(msg){

      let content = msg.content.toString();
      let secs = content.split('.').length - 1;

      console.log(`Received ${content}`);
      setTimeout(function(){
        console.log('Done');
        channel.ack(msg);
      }, secs * 1000);
    }, {
      noAck: false
    });
  });
});
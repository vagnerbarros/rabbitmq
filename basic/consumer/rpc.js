const amqp = require('amqplib/callback_api');

amqp.connect('amqp://username:password@localhost/demo_virtual_host', function(connectionError, connection) {
  if(connectionError){
    throw connectionError;
  }

  connection.createChannel(function(channelError, channel){
    if(channelError){
      throw channelError;
    }

    let queue = 'rpc_queue';
  
    channel.assertQueue(queue, {
      durable: true
    });
    channel.prefetch(1);
  
    channel.consume(queue, function(msg){

      let number = parseInt(msg.content.toString());
      console.log(`Fib(${number})`);

      let result = fibonacci(number);

      channel.sendToQueue(msg.properties.replyTo, Buffer.from(result.toString()), {
        correlationId: msg.properties.correlationId
      });
      
      channel.ack(msg);
    });
  });
});

function fibonacci(n) {
  if (n == 0 || n == 1)
    return n;
  else
    return fibonacci(n - 1) + fibonacci(n - 2);
}
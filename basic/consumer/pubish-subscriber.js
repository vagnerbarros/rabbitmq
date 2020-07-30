const amqp = require('amqplib/callback_api');

amqp.connect('amqp://username:password@localhost/demo_virtual_host', function(connectionError, connection) {
  if(connectionError){
    throw connectionError;
  }

  connection.createChannel(function(channelError, channel){
    if(channelError){
      throw channelError;
    }

    let exchange = 'logs';
  
    channel.assertExchange(exchange, 'fanout', {
      durable: false
    });
    channel.assertQueue('', {
      exclusive: true
    }, function(queueError, q){
      if(queueError){
        throw queueError;
      }

      channel.bindQueue(q.queue, exchange, '');

      channel.consume(q.queue, function(msg){
        if(msg.content){
          console.log(`Msg: ${msg.content.toString()}`);
        }
      }, {
        noAck: true
      });
    });
  });
});
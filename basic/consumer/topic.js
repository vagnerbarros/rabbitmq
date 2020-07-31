const amqp = require('amqplib/callback_api');

let args = process.argv.slice(2);
if(args.length === 0){
  console.log('Usage node routing.js <facility>.<severity>');
  process.exit(1);
}

amqp.connect('amqp://username:password@localhost/demo_virtual_host', function(connectionError, connection) {
  if(connectionError){
    throw connectionError;
  }

  connection.createChannel(function(channelError, channel){
    if(channelError){
      throw channelError;
    }

    let exchange = 'topic_logs';
  
    channel.assertExchange(exchange, 'topic', {
      durable: false
    });

    channel.assertQueue('', {
      exclusive: true
    }, function(queueError, q){
      if(queueError){
        throw queueError;
      }

      args.forEach(key => {
        channel.bindQueue(q.queue, exchange, key);
      });

      channel.consume(q.queue, function(msg){
        if(msg.content){
          console.log(`RoutingKey: ${msg.fields.routingKey} Msg: ${msg.content.toString()}`);
        }
      }, {
        noAck: true
      });
    });
  });
});
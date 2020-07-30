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
    let msg = process.argv.slice(2).join(' ') || "Hello World";
  
    channel.assertExchange(exchange, 'fanout', {
      durable: false
    });
  
    channel.publish(exchange, '', Buffer.from(msg));
    console.log(`Sent ${msg}`);
  
    setTimeout(function(){
      connection.close();
      process.exit(0);
    }, 500);
  });
});
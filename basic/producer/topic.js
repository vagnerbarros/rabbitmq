const amqp = require('amqplib/callback_api');

amqp.connect('amqp://username:password@localhost/demo_virtual_host', function(connectionError, connection) {
  if(connectionError){
    throw connectionError;
  }

  connection.createChannel(function(channelError, channel){
    if(channelError){
      throw channelError;
    }

    let exchange = 'topic_logs';
    let args = process.argv.slice(2);
    let key = (args.length > 0) ? args[0] : 'anonymous.info';
    let msg = args.slice(1).join(' ') || "Hello World";

    channel.assertExchange(exchange, 'topic', {
      durable: false
    });
  
    channel.publish(exchange, key, Buffer.from(msg));
    console.log(`Sent Key: ${key}, Msg: ${msg}`);
  
    setTimeout(function(){
      connection.close();
      process.exit(0);
    }, 500);
  });
});
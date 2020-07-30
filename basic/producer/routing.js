const amqp = require('amqplib/callback_api');

amqp.connect('amqp://username:password@localhost/demo_virtual_host', function(connectionError, connection) {
  if(connectionError){
    throw connectionError;
  }

  connection.createChannel(function(channelError, channel){
    if(channelError){
      throw channelError;
    }

    let exchange = 'direct_logs';
    let args = process.argv.slice(2);
    let msg = args.slice(1).join(' ') || "Hello World";
    let severity = (args.length > 0) ? args[0] : 'info';

    channel.assertExchange(exchange, 'direct', {
      durable: false
    });
  
    channel.publish(exchange, severity, Buffer.from(msg));
    console.log(`Sent ${msg}`);
  
    setTimeout(function(){
      connection.close();
      process.exit(0);
    }, 500);
  });
});
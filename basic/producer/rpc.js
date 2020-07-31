const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);
if(args.length === 0){
  console.log("Usage: node rpc.js <num>");
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

    channel.assertQueue('', {
      exclusive: true
    }, function(queueError, q){
      if(queueError){
        throw queueError;
      }

      const correlationId = generateUuid();
      const num = parseInt(args[0]);

      channel.consume(q.queue, function(msg){
        if(msg.properties.correlationId === correlationId){
          console.log(`Result: ${msg.content.toString()}`);
          setTimeout(function(){
            connection.close();
            process.exit(0);
          }, 500);
        }
      }, {
        noAck: true
      });

      channel.sendToQueue('rpc_queue', Buffer.from(num.toString()), {
        correlationId: correlationId,
        replyTo: q.queue
      });
    })
  });
});

function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}
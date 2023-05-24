const amqp = require('amqplib');
const Listener = require('./Listener');
const MailerService = require('./services/mailer/MailerService');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const config = require('./utils/config');

const init = async () => {
  const listener = new Listener(
    new PlaylistsService(),
    new MailerService(),
  );
  const connection = await amqp.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();

  await channel.assertQueue(config.rabbitMq.queue, {
    durable: true,
  });

  channel.consume(config.rabbitMq.queue, listener.listen, { noAck: true });

  console.log('Consumer is running...');
};

module.exports = init;

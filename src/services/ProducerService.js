/* eslint-disable import/no-extraneous-dependencies */
const amqlp = require('amqplib');

const ProducerService = {
  sendMessage: async (queue, message) => {
    const connection = await amqlp.connect(process.env._RABBITMQ_SERVER);
    const chanel = await connection.createChannel();

    await chanel.assertQueue(queue, {
      durable: true,
    });

    await chanel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    });
  },
};

module.exports = ProducerService;

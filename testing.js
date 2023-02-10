// const Joi = require('joi');
// const InvariantError = require('./src/exceptions/InvariantError');

// const ExportSchema = Joi.object({
//   targetEmail: Joi.string().email({ tlds: true }).required(),
// });

// const ExportsValidator = {
//   validateExports: (payload) => {
//     const validationResult = ExportSchema.validate(payload);

//     if (validationResult.error) {
//       throw new InvariantError(validationResult.error.message);
//     }
//   },
// };

// const payload = {
//    targetEmail: 'aikhgjahg',
// }

// ExportsValidator.validateExports(payload);

const amqp = require('amqplib');

const ProducerService = {
  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

const messages = {
  targetEmail: 'fajritio376@gmail.com',
};

ProducerService.sendMessage('exports:email', JSON.stringify(messages));

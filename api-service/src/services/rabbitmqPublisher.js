import amqp from 'amqplib';

export async function publishMessage(message) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = 'emailQueue';
  await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message));
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.error('RabbitMQ error:', err.message);
  }
}

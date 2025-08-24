import amqp from "amqplib";

async function startConsumer() {
  const queue = "emailQueue";

  try {
    // Connect to RabbitMQ broker
    const connection = await amqp.connect("amqp://rabbitmq:5672");
    const channel = await connection.createChannel();

    // Ensure durable queue (survives broker restart)
    await channel.assertQueue(queue, { durable: true });

    console.log(`[*] Waiting for messages in queue: ${queue}. To exit press CTRL+C`);

    // Consume messages
    channel.consume(
      queue,
      (msg) => {
        if (msg !== null) {
          const message = msg.content.toString();
          console.log(`[x] Received: ${message}`);

          // Acknowledge the message so it's removed from queue
          channel.ack(msg);
        }
      },
      { noAck: false } // important: don’t auto-acknowledge
    );
  } catch (err) {
    console.error("❌ Consumer error:", err);
  }
}

startConsumer();

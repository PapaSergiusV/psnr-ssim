import amqp from 'amqplib';
import { config } from 'dotenv';

import { HUB, QUEUES } from './const';

config();

const url = process.env.AMQP_URL;
let connection: amqp.Connection;
let channel: amqp.Channel;

const dot = (a: string, b: string): string => `${a}.${b}`;

export const sendToChannel = (destination: string, data: any) => {
  console.log('Sending to', destination, ':', data);
  return channel.publish(HUB, destination, Buffer.from(JSON.stringify(data), 'utf-8'), { persistent: true });
};

type QueueCallback = {
  queue: string;
  callback: (msg: amqp.ConsumeMessage, ch: amqp.Channel) => void;
};

export const listen = async (queuesCallbacks: QueueCallback[]) => {
  connection = await amqp.connect(url);
  channel = await connection.createChannel();
  if (channel) {
    await channel.prefetch(1);
    queuesCallbacks.forEach((qc) => {
      channel.consume(qc.queue, (m) => {
        qc.callback(m, channel);
      });
    });
    console.log(`Microservice is listening ${queuesCallbacks.map((qc) => qc.queue).join(', ')}`);
  }
};

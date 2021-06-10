import amqp from 'amqplib';
import { config } from 'dotenv';

import { HUB, QUEUES } from './const';

config();

const url = process.env.AMQP_URL;
let connection: amqp.Connection;
let channel: amqp.Channel;

const dot = (a: string, b: string): string => `${a}.${b}`;

export const setupAMQP = async () => {
  console.log('Setting up exchanges and queues...');

  try {
    connection = await amqp.connect(url);
    channel = await connection.createChannel();
    await channel.assertExchange(HUB, 'direct', { durable: true });
    // create queues
    await channel.assertQueue(dot(HUB, QUEUES.GATEWAY_COMPARATOR), { durable: true });
    await channel.assertQueue(dot(HUB, QUEUES.COMPARATOR_DB), { durable: true });
    await channel.assertQueue(dot(HUB, QUEUES.WEB_DB), { durable: true });
    await channel.assertQueue(dot(HUB, QUEUES.DB_WEB), { durable: true });
    // bind queues
    await channel.bindQueue(dot(HUB, QUEUES.GATEWAY_COMPARATOR), HUB, QUEUES.GATEWAY_COMPARATOR);
    await channel.bindQueue(dot(HUB, QUEUES.COMPARATOR_DB), HUB, QUEUES.COMPARATOR_DB);
    await channel.bindQueue(dot(HUB, QUEUES.WEB_DB), HUB, QUEUES.WEB_DB);
    await channel.bindQueue(dot(HUB, QUEUES.DB_WEB), HUB, QUEUES.DB_WEB);
    console.log('Setup completed.');
  } catch (err) {
    console.log('Setup failed.\n', err);
  }
};

export const sendToChannel = (destination: string, data: any) => {
  console.log('Sending to', destination, ':', data);
  return channel.publish(HUB, destination, Buffer.from(JSON.stringify(data), 'utf-8'), { persistent: true });
};

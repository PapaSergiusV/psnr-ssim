import amqp from 'amqplib';
import { existsSync } from 'fs';
import { config } from 'dotenv';

import { HUB, QUEUES } from './const';
import { compare } from './comparator';
import { parseStdout } from './parser';
import { Request, isValidRequest, VideoMetrics, VideoInfo } from './types';

config();
const ip = process.env.IP;
const url = process.env.AMQP_URL;
const microserviceName = process.env.MICNAME;
const queues = {
  fromGateway: `${HUB}.${QUEUES.GATEWAY_COMPARATOR}`,
  toDB: QUEUES.COMPARATOR_DB,
}
let channel: amqp.Channel;

export const sendToChannel = (destination: string, data: any) => {
  console.log('Sending to', destination, ':', data.path);
  return channel.publish(HUB, destination, Buffer.from(JSON.stringify(data), 'utf-8'), { persistent: true });
};

const handleMessage = async (msg: amqp.ConsumeMessage) => {
  const { content } = msg;
  const data: Request = JSON.parse(content.toString());
  console.log('PROCESSING:', data.copy);

  if (isValidRequest(data) && existsSync(data.original) && existsSync(data.copy)) {
    const stdout = await compare(data);
    const metrics: VideoMetrics = parseStdout(stdout);
    const result: VideoInfo = {
      ...metrics,
      path: data.copy,
      codec: data.codec,
      resolution: data.resolution,
      ip,
    };
    sendToChannel(queues.toDB, result);
  } else {
    console.error('Wrong params:', data);
  }
  
  await channel.ack(msg);
};

const listen = async () => {
  const connection = await amqp.connect(url);
  channel = await connection.createChannel();
  await channel.prefetch(1);
  channel.consume(queues.fromGateway, handleMessage);
  console.log(`Microservice ${microserviceName} is running`);
};

listen();

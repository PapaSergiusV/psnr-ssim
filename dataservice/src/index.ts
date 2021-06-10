import * as amqp from 'amqplib';
import { config } from 'dotenv';

import { VideoRepository } from './VideoRepository';
import { Video } from './entity/Video';
import { QUEUES, HUB } from './const';
import { VideoInfo } from './types';

const videoRepository = new VideoRepository();

const dot = (a: string, b: string): string => `${a}.${b}`;

config();
const url = process.env.AMQP_URL;
const microserviceName = process.env.MICNAME;
let channel: amqp.Channel;
const queues = {
  fromComparator: dot(HUB, QUEUES.COMPARATOR_DB),
  fromWeb: dot(HUB, QUEUES.WEB_DB),
  toWeb: QUEUES.DB_WEB,
};

const handleComparatorMessage = async (msg: amqp.ConsumeMessage) => {
  const { content } = msg;
  const data: VideoInfo = JSON.parse(content.toString());
  const video = new Video();
  for (let key in data) video[key] = data[key];
  try {
    videoRepository.add(video);
    console.log('Video data', video.path, 'successfully saved');
    await channel.ack(msg);
  } catch (err) {
    console.error('Video data processing error:', err);
  }
};

const handleWebMessage = async (msg: amqp.ConsumeMessage) => {
  const { content } = msg;

  await channel.ack(msg);
};

const listen = async () => {
  const connection = await amqp.connect(url);
  channel = await connection.createChannel();
  await channel.prefetch(1);
  channel.consume(queues.fromComparator, handleComparatorMessage);
  channel.consume(queues.fromWeb, handleWebMessage);
  console.log(`Microservice ${microserviceName} is running`);
};

listen();

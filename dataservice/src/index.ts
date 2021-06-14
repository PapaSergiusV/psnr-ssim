import * as amqp from 'amqplib';
import { config } from 'dotenv';

import { VideoRepository } from './VideoRepository';
import { Video } from './entity/Video';
import { QUEUES, HUB } from './const';
import { VideoInfo, WebRequest, WebResponse } from './types';
import { FindManyOptions } from 'typeorm';

const db = new VideoRepository();

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

export const sendToChannel = (destination: string, data: any) => {
  return channel.publish(HUB, destination, Buffer.from(JSON.stringify(data), 'utf-8'), { persistent: true });
};

const handleComparatorMessage = async (msg: amqp.ConsumeMessage) => {
  const { content } = msg;
  const data: VideoInfo = JSON.parse(content.toString());
  const video = new Video();
  for (let key in data) video[key] = data[key];
  try {
    db.add(video);
    console.log('Video data', video.path, 'successfully saved');
    await channel.ack(msg);
  } catch (err) {
    console.error('Video data saving error:', err);
  }
};

const handleWebMessage = async (msg: amqp.ConsumeMessage) => {
  const { content } = msg;
  const req: WebRequest = JSON.parse(content.toString());
  const { msgId } = req;
  await channel.ack(msg);
  const params: FindManyOptions<Video> = { order: { id: 'ASC' } };
  if (req.codecs) params.where = req.codecs.map((codec) => ({ codec }));
  else if (req.videos) params.where = req.videos.map((path) => ({ path }));
  const videos = await db.findAll(params);
  const resp: WebResponse = { msgId, videos };
  return sendToChannel(queues.toWeb, resp);
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

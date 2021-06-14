import express, { Response } from 'express';
import amqp from 'amqplib';
import { config } from 'dotenv';
import { sendToChannel, listen } from './rabbitmq';
import { QUEUES, HUB } from './const';
import { createGenerator } from './generator';
import { WebResponse } from './types';

config();
const port = process.env.PORT;
const microserviceName = process.env.MICNAME;

const app = express();
app.use(express.json());
const genId = createGenerator();
const responsesStore: Record<number, Response> = {};

app.post('/statistic', (req, res: Response) => {
  console.log(req.body);
  const msgId = genId();
  sendToChannel(QUEUES.WEB_DB, { msgId, ...req.body });
  responsesStore[msgId] = res;
});

app.listen(port, () => {
  console.log(`Service ${microserviceName} is running on port ${port}, pid: ${process.pid}`);
})

const handleDBMsgs = async (msg: amqp.ConsumeMessage, channel: amqp.Channel) => {
  const { content } = msg;
  const data: WebResponse = JSON.parse(content.toString());
  if (responsesStore[data.msgId]) {
    responsesStore[data.msgId].send(data.videos);
    setTimeout(() => {
      delete responsesStore[data.msgId];
    }, 1000);
  }
  await channel.ack(msg);
};

listen([{ queue: `${HUB}.${QUEUES.DB_WEB}`, callback: handleDBMsgs }]);

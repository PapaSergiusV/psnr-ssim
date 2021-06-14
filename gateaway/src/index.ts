import express from 'express';
import { config } from 'dotenv';
import { setupAMQP, sendToChannel } from './rabbitmq';
import { QUEUES } from './const';
import { proxy } from './proxy';

config();
const port = process.env.PORT;
const webApi = process.env.WEB_API;
const microserviceName = process.env.MICNAME;

const app = express();
app.use(express.json());

app.post('/statistic', async (req, res) => {
  const { data } = await proxy.post(`${webApi}/statistic`, req.body);
  res.send(data);
});

app.post('/compare', (req, res) => {
  const ok = sendToChannel(QUEUES.GATEWAY_COMPARATOR, req.body);
  if (ok) res.send();
  else res.status(503).send();
});

app.listen(port, () => {
  console.log(`Service ${microserviceName} is running on port ${port}, pid: ${process.pid}`);
})

setupAMQP();

import express from 'express';
import { config } from 'dotenv';
import { setupAMQP, sendToChannel } from './rabbitmq';
import { QUEUES } from './const';

config();
const port = process.env.PORT;
const microserviceName = process.env.MICNAME;

const app = express();
app.use(express.json());

app.post('/compare', (req, res) => {
  const ok = sendToChannel(QUEUES.GATEWAY_COMPARATOR, req.body);
  if (ok) res.send();
  else res.status(503).send();
});

app.listen(port, () => {
  console.log(`Service ${microserviceName} is running on port ${port}, pid: ${process.pid}`);
})

setupAMQP();

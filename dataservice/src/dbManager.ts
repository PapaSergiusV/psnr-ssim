import { createConnection, EntityManager } from 'typeorm';

let manager: EntityManager;

const initManager = async () => {
  const conn = await createConnection();
  manager = conn.manager;
};

initManager();

export default manager;

import { MongoClient } from 'mongodb';

const MONGOURI = 'mongodb://localhost:27017/challenge';

export const getDb = async () => {
  const client: any = await MongoClient.connect(MONGOURI);
  return client.db();
};

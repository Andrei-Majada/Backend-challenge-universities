import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

export const getDb = async () => {
  const client: any = await MongoClient.connect(process.env.MONGOURI);
  return client.db();
};

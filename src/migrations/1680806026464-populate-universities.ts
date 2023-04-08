import { getDb } from '../migrations-utils/db';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { University } from 'src/universities/university.schema';
dotenv.config();

export const up = async () => {
  try {
    const db = await getDb();
    const collection = await db.collection('universities');

    const countrysList = [
      'Argentina',
      'Brazil',
      'Chile',
      'Colombia',
      'Paraguay',
      'Peru',
      'Suriname',
      'Uruguay',
    ];
    const universitiesList: Array<University> = [];
    const reponse = await axios.get(process.env.UNIVERSITIES_URL);
    const universities = reponse.data;

    if (universities) {
      universities.forEach(async (university) => {
        if (countrysList.includes(university.country)) {
          const newUniversityObject = {
            ...university,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          universitiesList.push(newUniversityObject);
        }
      });
      await collection.insertMany(universitiesList);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const down = async () => {
  try {
    const db = await getDb();
    await db.collection('universities').deleteMany();
  } catch (error) {
    throw new Error(error);
  }
};

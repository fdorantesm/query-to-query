import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { parse } from '@query-to-query/core';
import { buildMongoQuery } from '@query-to-query/mongodb';

const runMongoTests = process.env.RUN_MONGODB_TESTS === 'true';

(runMongoTests ? describe : describe.skip)('mongodb adapter', () => {
  let mongod: MongoMemoryServer | null = null;
  let client: MongoClient | null = null;

  beforeAll(async () => {
    try {
      mongod = await MongoMemoryServer.create();
      client = new MongoClient(mongod.getUri());
      await client.connect();
      const collection = client.db('test').collection('users');
      await collection.insertMany([
        { name: 'admin', role: 'admin', age: '30' },
        { name: 'supervisor', role: 'supervisor', age: '25' },
        { name: 'user', role: 'user', age: '20' }
      ]);
    } catch (err) {
      console.warn(err);
    }
  });

  afterAll(async () => {
    if (client) await client.close();
    if (mongod) await mongod.stop();
  });

  it('builds filters and options usable by MongoDB', async () => {
    if (!mongod || !client) {
      console.warn('MongoMemoryServer not available, skipping test');
      return;
    }
    const queryString = 'filter[age][gte]=18&filter[role][in]=admin,supervisor&options[select]=name,role&sort=-age&options[limit]=1';
    const parsed = parse(queryString);
    const { filter, options } = buildMongoQuery(parsed);
    const collection = client.db('test').collection('users');
    const results = await collection.find(filter, options).toArray();
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ name: 'admin', role: 'admin' });
    expect(results[0]).not.toHaveProperty('age');
  });

  it('supports regex filters and multi-field sorting with skip', async () => {
    if (!mongod || !client) {
      console.warn('MongoMemoryServer not available, skipping test');
      return;
    }
    const queryString = 'filter[role][regex]=.*&sort=role,-age&options[skip]=1';
    const parsed = parse(queryString);
    const { filter, options } = buildMongoQuery(parsed);
    const collection = client.db('test').collection('users');
    const results = await collection.find(filter, options).toArray();
    expect(results).toHaveLength(2);
    expect(results[0]).toMatchObject({ name: 'supervisor' });
  });
});

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const redis = require('redis');
const {
  pgUser,
  pgHost,
  pgDatabase,
  pgPassword,
  pgPort,
  redisHost,
  redisPort,
} = require('./keys');

//* Server setup
const app = express();

app.use(cors());
app.use(express.json());

//* Postgres server setup
const pgClient = new Pool({
  user: pgUser,
  host: pgHost,
  database: pgDatabase,
  password: pgPassword,
  port: pgPort,
});

pgClient.on('error', () => console.log('Lost connection ...'));

pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .then(() => console.log('Success'))
  .catch((err) => console.log('Error: ', err.message));

//* Redis client setup
const redisClient = redis.createClient({
  host: redisHost,
  post: redisPort,
  retry_strategy: () => 2000,
});

const redisPublisher = redisClient.duplicate();

//* Express Routes setup
app.get('/', (req, res) => {
  res.send('Welcome ....');
});

app.get('/values/all', async (req, res) => {
  try {
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows);
  } catch (err) {
    console.log(err);
  }
});

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    if (err) {
      console.log(err);
    }
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  try {
    const { index } = req.body;
    if (parseInt(index > 40)) {
      return res.status(422).send('Too high ...');
    }

    redisClient.hset('values', index, 'Nothing yet ...');
    redisPublisher.publish('insert', index);

    await pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({ success: true });
  } catch (err) {
    console.log(err);
  }
});

app.listen(5000, () => {
  console.log('Listening on port 5000 ...');
});

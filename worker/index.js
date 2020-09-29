const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  post: keys.redisPort,
  retry_strategy: () => 2000
});

const redisSubcription = redisClient.duplicate();

const fibonacci = index => {
  if (index < 2) return 1;
  else return fibonacci(index - 1) + fibonacci(index - 2);
};

redisSubcription.on('message', (channel, message) => {
  console.log('worker', message, channel);
  redisClient.hset('values', message, fibonacci(parseInt(message)));
});

redisSubcription.subscribe('insert');

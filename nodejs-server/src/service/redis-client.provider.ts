import Redis from 'ioredis';

export const RedisClientProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    return new Redis({
      host: process.env.REDIS_HOST,
      port: 6379,
      db: 0,
    });
  },
};
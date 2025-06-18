import * as redisStore from 'cache-manager-ioredis';
import { Cache } from 'cache-manager';

export const RedisCacheProvider = {
  provide: 'REDIS_CACHE',
  useFactory: async (): Promise<Cache> => {
    const store = await redisStore.create({
      host: process.env.REDIS_HOST,
      port: 6379,
      db: 0,
      ttl: 60 * 60,
    });

    return store as unknown as Cache;
  },
};
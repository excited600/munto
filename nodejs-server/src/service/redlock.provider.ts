import Redlock from 'redlock';
import { Redis } from 'ioredis';

export const RedlockProvider = {
  provide: 'REDLOCK',
  inject: ['REDIS_CLIENT'],
  useFactory: (redisClient: Redis) => {
    return new Redlock([redisClient], {
      retryCount: 0,
    });
  },
};
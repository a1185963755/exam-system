import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async keys(pattern: string) {
    return await this.redisClient.keys(pattern);
  }

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async zAdd(key: string, data: { score: number; value: string }[]) {
    await this.redisClient.zAdd(key, data);
  }

  async zRankList(key: string, start: number = 0, stop: number = -1) {
    const res = await this.redisClient.zRange(key, start, stop, {
      REV: true,
    });
    const promsises = res.map((item) => this.redisClient.zScore(key, item));
    const scores = await Promise.all(promsises);
    return res.map((item, index) => {
      return {
        name: item,
        score: scores[index],
      };
    });
  }
}

import { createClient, RedisClientType } from "redis";
import { env } from "../config/env";

export class RedisService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({ url: env.redis.url });
    this.connect();
  }

  private async connect() {
    await this.client.connect();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}
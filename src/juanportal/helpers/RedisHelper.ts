import redis from "redis";
import dotenv from "dotenv";
import redisCache from "express-redis-cache";
dotenv.config();
import logger from "./logger";

interface IParams {
  cache?: boolean;
  pub?: boolean;
  sub?: boolean;
}
interface IKVPair {
  [key: string]: string;
}

export interface IRedisCacheHelper {
  port: number;
  host: string;
  cacheDuration: number;
  cache: redisCache.ExpressRedisCache;
}

/**
 * @example
 * For caching:
 * const RedisHelper = require('../helpers/RedisHelper')
 * const Redis = new RedisHelper({cache?: true|false, pub?: true|false, sub?: true|false})
 * app.get('/', Redis.cache.route('index'), (req, res) => {})
 *
 * For pub/sub:
 * const RedisHelper = require('../helpers/RedisHelper')
 * const Redis = new RedisHelper({pub: true, sub: true})
 * Redis.sub.on('subscribe', (channel, count) => {
 *   Redis.pub.publish(Redis.channels.chat, 'Ive just subscribed! #sentByNode')
 * })
 * Redis.sub.on('message', (channel, message) => {
 *   if (channel === Redis.channels.chat) {
 *     console.log('Received message from redis in node: Channel=' + channel + '. Message=' + message)
 *   }
 * })
 * Redis.sub.subscribe(Redis.channels.chat)
 *
 * @param {boolean} cache Define where this instance will be used for caching so it can create the cache property
 * @param {boolean} pub True for if this instance will use a publisher
 * @param {boolean} sub True if this instance will use a subscriber
 */
export class RedisHelper {
  public readonly host: string | undefined = process.env.REDIS_HOST;
  public readonly port: number | undefined = Number(process.env.REDIS_PORT);
  public readonly cacheDuration: number | undefined = Number(
    process.env.REDIS_CACHE_EXPIRE
  );
  public cache: redisCache.ExpressRedisCache | null = null;
  public sub: redis.RedisClient | null = null;
  public pub: redis.RedisClient | null = null;
  public readonly channels: IKVPair = {
    chat: "chat",
  };

  public constructor(params: IParams) {
    if (params && params.cache) {
      this.cache = redisCache({
        host: this.host,
        port: this.port,
        expire: this.cacheDuration,
      });
      this.initialiseCacheLogging();
    }
    if (params && params.sub) {
      this.sub = redis.createClient({
        host: this.host,
        port: this.port as number,
      });
    }
    if (params && params.pub) {
      this.pub = redis.createClient({
        host: this.host,
        port: this.port as number,
      });
    }
  }

  private initialiseCacheLogging(): void {
    if (this.cache) {
      this.cache
        // .on("error", (err) => {
        //   logger.error("Redis cache has encourtered a problem");
        //   logger.error(err);
        // })
        .on("message", (message) => {
          logger.info("Redis cache has received a message: " + message);
        })
        .on("connected", () => {
          logger.info("Redis cache has connected");
        });
      // .on("disconnected", () => {
      //   logger.info("Redis cache has disconnected");
      // });
    }
  }
}

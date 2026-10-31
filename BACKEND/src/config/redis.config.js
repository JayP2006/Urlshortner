import { createClient } from "redis";

export let redisClient = null;

export const connectRedis = async () => {

  try {

    if (!redisClient) {

      redisClient = createClient({
        url: process.env.REDIS_URL,
      });

      redisClient.on("error", (error) => {
        console.error("Redis client error:", error);
      });
    }

    if (redisClient.isReady) return true;

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    if (redisClient.isReady) {
      console.log("Redis connected successfully.");
      return true;
    }

    console.warn(
      "Redis is not ready yet. Using MongoDB fallback."
    );

    return false;

  } catch (error) {

    console.error(
      "Redis connection failed. Continuing without Redis:",
      error.message
    );

    return false;
  }
};

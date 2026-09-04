import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import dotenv from "dotenv";

dotenv.config();

// Create a new ratelimiter, that allows 5 requests per 10 seconds
const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(), // redis object from Upstash used to store the request count and timestamps to implement the rate limiting logic.
  limiter: Ratelimit.slidingWindow(100, "60 s"), // sliding window algorithm that allows 100 requests per 60 seconds. It means that if a user makes 100 requests in 60 seconds, they will be blocked from making any more requests until the 60-second window has passed.
});

export default rateLimit;

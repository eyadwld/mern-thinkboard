import rateLimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const identifier = req.ip || "anonymous";
    const { success } = await rateLimit.limit(identifier); // Use client IP as key so each user has their own independent rate-limit bucket.
    if (!success) {
      const error = new Error("Too many requests, please try again later.");
      error.statusCode = 429;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default rateLimiter;

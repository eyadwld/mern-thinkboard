import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  try {
    // Token is read from the HttpOnly cookie — never exposed to JS
    const token = req.cookies?.token;

    if (!token) {
      const error = new Error("Not authenticated");
      error.statusCode = 401;
      throw error;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 401;
    }
    next(error);
  }
};

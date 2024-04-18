import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Middleware function to verify the access token in the request headers
export const verifyAccessToken = (req, res, next) => {
  // Extract the token from the request headers
  const token = req.headers["x-auth-token"];
  // Check if the token exists
  if (!token) return res.sendStatus(401);

  // Verify the token with the secret key
  jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET, (err, decoded) => {
    // Handle verification errors
    if (err) {
      console.error("Error verifying token:", err);
      // Check if the error is due to token expiration
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      } else {
        return res.status(403).json({ message: "Invalid Token" });
      }
    }

    // Check if the decoded token contains the expected properties
    if (decoded && decoded.email && decoded.role) {
      req.email = decoded.email;
      req.role = decoded.role;
      next();
    } else {
      // Invalid decoded token
      console.error("Invalid decoded token:", decoded);
      return res.status(403).json({ message: "Invalid Token" });
    }
  });
};

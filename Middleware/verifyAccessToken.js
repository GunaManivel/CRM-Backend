import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyAccessToken = (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err);
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
      console.error("Invalid decoded token:", decoded);
      return res.status(403).json({ message: "Invalid Token" });
    }
  });
};

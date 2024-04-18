// Define allowed origins for CORS
const allowedOrigins = [
  "https://crm-backend-vk8v.onrender.com",
  "http://localhost:4000",
  "https://crm-capstone-mern.netlify.app",
];

// Configure CORS options
export const corsOptions = {
  // Check if the request origin is allowed
  origin: (origin, callback) => {
    // If the request origin is in the allowedOrigins array or if it's null (e.g., a same-origin request), allow the request
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // Otherwise, deny the request
      callback(new Error("Not allowed by CORS"));
    }
  },
  // Set the success status code for preflight OPTIONS requests
  optionsSuccessStatus: 200,
};

const allowedOrigins = [
  "https://crm-backend-vk8v.onrender.com",
  "http://localhost:4000",
  "https://crm-capstone-mern.netlify.app",
];

export const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

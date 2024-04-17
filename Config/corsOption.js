const allowedOrigins = [
  "http://127.0.0.1:4000",
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

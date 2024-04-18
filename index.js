import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { corsOptions } from "./Config/corsOption.js"; // Importing CORS options
import { mongoConnection } from "./db.js"; // Importing database connection function
import { userRouter } from "./Routers/usersRouter.js"; // Importing user router
import { adminRouter } from "./Routers/adminRouter.js"; // Importing admin router
import { productsRouter } from "./Routers/productsRouter.js"; // Importing products router
import { ordersRouter } from "./Routers/ordersRouter.js"; // Importing orders router
import { requestRouter } from "./Routers/requestsRouter.js"; // Importing requests router
import { leadsRouter } from "./Routers/leadsRouter.js"; // Importing leads router

dotenv.config(); // Loading environment variables

const PORT = process.env.PORT || 3500; // Setting the port

const app = express(); // Creating an Express application

// Establishing connection to the MongoDB database
mongoConnection();

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded form data
app.use(express.urlencoded({ extended: false }));

// Middleware for enabling CORS
app.use(cors());

// Routing for different endpoints
app.use("/user", userRouter); // User routes
app.use("/admin", adminRouter); // Admin routes
app.use("/products", productsRouter); // Product routes
app.use("/orders", ordersRouter); // Order routes
app.use("/request", requestRouter); // Request routes
app.use("/leads", leadsRouter); // Lead routes

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

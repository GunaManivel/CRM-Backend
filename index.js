import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { corsOptions } from "./Config/corsOption.js";
import { mongoConnection } from "./db.js";
import { userRouter } from "./Routers/usersRouter.js";
import { adminRouter } from "./Routers/adminRouter.js";
import { productsRouter } from "./Routers/productsRouter.js";
import { ordersRouter } from "./Routers/ordersRouter.js";
import { requestRouter } from "./Routers/requestsRouter.js";
import { leadsRouter } from "./Routers/leadsRouter.js";

const PORT = process.env.PORT || 3500;
const app = express();

//DataBase connection
mongoConnection();

//in-built middleware for JSON
app.use(express.json());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// To handle Cross Origin Resource Sharing - allowing sharing
app.use(cors());

//Base Route - Router
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/request", requestRouter);
app.use("/leads", leadsRouter);

// Listening to server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// import crypto from 'crypto'
// console.log(crypto.randomBytes(64).toString('hex'));

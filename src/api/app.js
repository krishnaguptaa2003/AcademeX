// src\api\app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.use(errorMiddleware);

export default app;

import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import router from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.corsOrigins.length === 0 || env.corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    },
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

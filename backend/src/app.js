import cors from "cors";
import express from "express";
import morgan from "morgan";
import router from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

import path from "node:path";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./config/env.js";
import { adminRouter } from "./routes/admin.routes.js";
import { publicRouter } from "./routes/public.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      const isLocalDevOrigin =
        env.NODE_ENV === "development" &&
        Boolean(origin?.match(/^http:\/\/(localhost|127\.0\.0\.1):\d+$/));

      if (!origin || origin === env.FRONTEND_URL || isLocalDevOrigin) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve(process.cwd(), env.UPLOAD_DIR), { maxAge: "7d" }));

app.use("/api", publicRouter);
app.use("/api/admin", adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);

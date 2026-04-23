import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import batchRoutes from "./routes/batches.js";
import sessionRoutes from "./routes/sessions.js";
import attendanceRoutes from "./routes/attendance.js";
import institutionRoutes from "./routes/institution.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));
const port = process.env.PORT || 3000;
app.use("/api/auth", authRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/institutions", institutionRoutes);


app.get("/", (req, res) => res.send("Hello World!"));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(port, () =>
      console.log(`App listening on port ${port}! and MongoDb connected `),
    ),
  )
  .catch((err) => console.log(err));

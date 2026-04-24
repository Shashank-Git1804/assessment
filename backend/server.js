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

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_LOCAL,
  "https://assessment-one-rho.vercel.app",
  "https://assessment-mtbquoaqb-shashank-git1804s-projects.vercel.app",
  "https://role-based-authorization.netlify.app"
].filter(Boolean);

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  }
}));
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

import express from "express";
import Session from "../models/Session.js";
import Attendance from "../models/Attendance.js";
import Batch from "../models/Batch.js";
import { protect, allow } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, allow("trainer"), async (req, res) => {
  try {
    const session = await Session.create({ ...req.body, trainerId: req.user._id });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/batch/:batchId", protect, allow("trainer"), async (req, res) => {
  try {
    const sessions = await Session.find({ batchId: req.params.batchId }).sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/active", protect, allow("student"), async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const batches = await Batch.find({ students: req.user._id }, "_id");
    const batchIds = batches.map((b) => b._id);
    const sessions = await Session.find({
      batchId: { $in: batchIds },
      date: { $gte: today },
    }).populate("batchId", "name").populate("trainerId", "name");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id/attendance", protect, allow("trainer"), async (req, res) => {
  try {
    const records = await Attendance.find({ sessionId: req.params.id }).populate("studentId", "name email");
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

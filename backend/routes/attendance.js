import express from "express";
import Attendance from "../models/Attendance.js";
import Session from "../models/Session.js";
import Batch from "../models/Batch.js";
import { protect, allow } from "../middleware/auth.js";

const router = express.Router();

router.post("/mark", protect, allow("student"), async (req, res) => {
  try {
    const { sessionId, status } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const batch = await Batch.findOne({ _id: session.batchId, students: req.user._id });
    if (!batch) return res.status(403).json({ message: "You have not joined this batch" });

    const existing = await Attendance.findOne({ sessionId, studentId: req.user._id });
    if (existing) return res.status(400).json({ message: "Attendance already marked" });

    const record = await Attendance.create({ sessionId, studentId: req.user._id, status });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/programme/summary", protect, allow("programme-manager", "monitoring-officer"), async (req, res) => {
  try {
    const total = await Attendance.countDocuments();
    const present = await Attendance.countDocuments({ status: "present" });
    const absent = await Attendance.countDocuments({ status: "absent" });
    res.json({ total, present, absent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

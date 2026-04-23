import express from "express";
import Session from "../models/Session.js";
import Attendance from "../models/Attendance.js";
import { protect, allow } from "../middleware/auth.js";
import Batch from "../models/Batch.js";


const router = express.Router();
router.post("/", protect, allow("trainer"), async (req, res) => {
  try {
    const session = await Session.create({
      ...req.body,
      trainerId: req.user._id,
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get(
  "/:id/attendance",
  protect,
  allow("trainer"),
  async (req, res) => {
    try {
      const records = await Attendance.find({
        sessionId: req.params.id,
      }).populate("studentId", "name email");
      res.json(records);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);
router.get("/active", protect, allow("student"), async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const batches = await Batch.find({ students: req.user._id }, "_id");
    const batchIds = batches.map((b) => b._id);
    
    const sessions = await Session.find({ 
      batchId: { $in: batchIds },
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

import express from "express";
import Batch from "../models/Batch.js";
import Attendance from "../models/Attendance.js";
import Session from "../models/Session.js";
import User from "../models/User.js";
import { protect, allow } from "../middleware/auth.js";

const router = express.Router();

// Get all institutions
router.get("/", protect, allow("programme-manager"), async (req, res) => {
  try {
    const institutions = await User.find({ role: "institution" }, "name email");
    res.json(institutions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get(
  "/:id/summary",
  protect,
  allow("programme-manager"),
  async (req, res) => {
    try {
      const batches = await Batch.find({
        institutionId: req.params.id,
      }).populate("students trainers");
      const batchIds = batches.map((b) => b._id);
      const sessions = await Session.find({ batchId: { $in: batchIds } });
      const sessionIds = sessions.map((s) => s._id);
      const total = await Attendance.countDocuments({
        sessionId: { $in: sessionIds },
      });
      const present = await Attendance.countDocuments({
        sessionId: { $in: sessionIds },
        status: "present",
      });
      const absent = await Attendance.countDocuments({
        sessionId: { $in: sessionIds },
        status: "absent",
      });
      const late = await Attendance.countDocuments({
        sessionId: { $in: sessionIds },
        status: "late",
      });
      res.json({ batches, total, present, absent, late });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

export default router;

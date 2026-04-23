import express from "express";
import Session from "../models/Session.js";
import Attendance from "../models/Attendance.js";
import { protect, allow } from "../middleware/auth.js";
import Batch from "../models/Batch.js";
import mongoose from "mongoose";


const router = express.Router();
router.post("/", protect, allow("trainer"), async (req, res) => {
  try {
    console.log("Creating session with data:", req.body);
    const session = await Session.create({
      ...req.body,
      trainerId: req.user._id,
    });
    console.log("Session created:", session);
    res.status(201).json(session);
  } catch (err) {
    console.error("Session creation error:", err);
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

// router.get("/debug", protect, allow("student"), async (req, res) => {
//   try {
//     const today = new Date();
//     const todayString = today.toISOString().split('T')[0];
    
//     const student = req.user;
    
//     const batches = await Batch.find({ students: req.user._id }).populate('trainers', 'name');
    
//     const allSessions = await Session.find({ date: todayString }).populate('batchId', 'name');
    
//     const batchIds = batches.map(b => b._id);
//     const studentSessions = await Session.find({ 
//       batchId: { $in: batchIds },
//       date: todayString
//     }).populate('batchId', 'name');
    
//     res.json({
//       student: { id: student._id, name: student.name, email: student.email },
//       todayString,
//       batches,
//       allSessions,
//       studentSessions
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.get("/all", protect, async (req, res) => {
  try {
    const sessions = await Session.find({}).populate('batchId', 'name').populate('trainerId', 'name');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/active", protect, allow("student"), async (req, res) => {
  try {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    console.log("Looking for sessions on date:", todayString);
    console.log("Student ID:", req.user._id);
    
    const batches = await Batch.find({ students: req.user._id }, "_id");
    console.log("Student batches:", batches);
    
    if (batches.length === 0) {
      console.log("Student is not enrolled in any batches");
      return res.json([]);
    }
    
    const batchIds = batches.map((b) => b._id);
    
    const sessions = await Session.find({ 
      batchId: { $in: batchIds },
      date: todayString
    }).populate('batchId', 'name').populate('trainerId', 'name');
    
    console.log("Found sessions:", sessions);
    res.json(sessions);
  } catch (err) {
    console.error("Sessions error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;

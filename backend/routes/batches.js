import express from "express";
import Batch from "../models/Batch.js";
import User from "../models/User.js";
import { protect, allow } from "../middleware/auth.js";
import crypto from "crypto";

const router = express.Router();

router.post("/", protect, allow("trainer", "institution"), async (req, res) => {
  try {
    const batchData = {
      ...req.body,
      institutionId: req.user.institutionId || req.user._id,
    };
   
    if (req.user.role === "trainer") {
      batchData.trainers = [req.user._id];
    }
    
    const batch = await Batch.create(batchData);
    res.status(201).json(batch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/:id/invite", protect, allow("trainer"), async (req, res) => {
  try {
    const code = crypto.randomBytes(8).toString("hex");
    await Batch.findByIdAndUpdate(req.params.id, { inviteCode: code }, { new: true });
    res.json({ inviteLink: `${process.env.CLIENT_URL}/join/${code}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/join", protect, allow("student"), async (req, res) => {
  try {
    const { code } = req.body;
    const batch = await Batch.findOne({ _id: req.params.id, inviteCode: code });
    if (!batch) return res.status(400).json({ message: "Invalid invite code" });
    if (!batch.students.includes(req.user._id)) batch.students.push(req.user._id);
    await batch.save();
    res.json({ message: "Joined batch", batch });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/institution", protect, allow("institution"), async (req, res) => {
  try {
    const batches = await Batch.find({ 
      institutionId: req.user._id 
    }).populate("students trainers", "name email");
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/my", protect, allow("student"), async (req, res) => {
  try {
    const batches = await Batch.find({ students: req.user._id }, "name _id");
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id/summary", protect, allow("institution"), async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id).populate("students trainers");
    res.json(batch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    default: "absent",
  },
  markedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Attendance", attendanceSchema);

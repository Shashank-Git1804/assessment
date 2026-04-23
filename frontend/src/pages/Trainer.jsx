// export default function Trainer() {
//     return (
//         <>
//             <h1>Trainer Dashboard</h1>
//             <p>Welcome to the trainer dashboard!</p>
//         </>
//     );
// }

import { useState } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Trainer() {
  const { auth } = useAuth();
  const [batch, setBatch] = useState({ name: "" });
  const [session, setSession] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    batchId: "",
  });
  const [inviteBatchId, setInviteBatchId] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [attendanceSessionId, setAttendanceSessionId] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [msg, setMsg] = useState("");

  const createBatch = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch("/batches", {
        method: "POST",
        body: JSON.stringify({ name: batch.name }),
      });
      console.log(data)
      setMsg(`Batch created: ${data.name} (ID: ${data._id})`);
    } catch (err) {
      setMsg(err.message);
    }
  };

  const generateInvite = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch(`/batches/${inviteBatchId}/invite`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      console.log(data);
      setInviteLink(data.inviteLink);
      let inviteCode = data.inviteLink.split("/").slice(-1)[0];
      setMsg(`Invite generated! Code: ${inviteCode} Link: ${data.inviteLink}`);
    } catch (err) {
      setMsg(err.message);
    }
  };

  const createSession = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch("/sessions", {
        method: "POST",
        body: JSON.stringify(session),
      });
      console.log(data);
      setMsg(`Session created: ${data.title} (ID: ${data._id})`);
    } catch (err) {
      setMsg(err.message);
    }
  };

  const createTestSession = async () => {
    const today = new Date().toISOString().split('T')[0];
    const testSession = {
      title: "Test Session",
      date: today,
      startTime: "10:00",
      endTime: "11:00",
      batchId: session.batchId || "ENTER_BATCH_ID_HERE"
    };
    
    try {
      const data = await apiFetch("/sessions", {
        method: "POST",
        body: JSON.stringify(testSession),
      });
      console.log(data);
      setMsg(`Test session created for today (${today}): ${data.title} (ID: ${data._id})`);
    } catch (err) {
      setMsg(err.message);
    }
  };

  const fetchAttendance = async (e) => {
    e.preventDefault();
    console.log(attendanceSessionId);
    try {
      const data = await apiFetch(
        `/sessions/${attendanceSessionId}/attendance`,
      );
      console.log(data)
      setAttendance(data);
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <>
      <h1>Trainer Dashboard</h1>
      <p>Welcome, {auth.user?.name}</p>
      {msg && <p style={{ color: "greenyellow" }}>{msg}</p>}

      <h2>Create Batch</h2>
      <form onSubmit={createBatch}>
        <div className="form-row">
          <label htmlFor="batchName">Batch Name</label>
          <input
            id="batchName"
            value={batch.name}
            onChange={(e) => setBatch({ name: e.target.value })}
            required
          />
        </div>
        <button type="submit">Create Batch</button>
      </form>

      <h2>Generate Invite Link</h2>
      <form onSubmit={generateInvite}>
        <div className="form-row">
          <label htmlFor="inviteBatchId">Batch ID</label>
          <input
            id="inviteBatchId"
            value={inviteBatchId}
            onChange={(e) => setInviteBatchId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Generate Invite</button>
      </form>
      {inviteLink && (
        <p>
          Invite Link: <a href={inviteLink}>{inviteLink}</a>
        </p>
      )}

      <h2>Create Session</h2>
      <button onClick={createTestSession} style={{marginBottom: '10px', backgroundColor: '#e0ffe0'}}>Quick: Create Test Session for Today</button>
      <form onSubmit={createSession}>
        <div className="form-row">
          <label htmlFor="sessionTitle">Title</label>
          <input
            id="sessionTitle"
            value={session.title}
            onChange={(e) => setSession({ ...session, title: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="sessionDate">Date</label>
          <input
            id="sessionDate"
            type="date"
            value={session.date}
            onChange={(e) => setSession({ ...session, date: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="startTime">Start Time</label>
          <input
            id="startTime"
            type="time"
            value={session.startTime}
            onChange={(e) =>
              setSession({ ...session, startTime: e.target.value })
            }
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="endTime">End Time</label>
          <input
            id="endTime"
            type="time"
            value={session.endTime}
            onChange={(e) =>
              setSession({ ...session, endTime: e.target.value })
            }
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="sessionBatchId">Batch ID</label>
          <input
            id="sessionBatchId"
            value={session.batchId}
            onChange={(e) =>
              setSession({ ...session, batchId: e.target.value })
            }
            required
          />
        </div>
        <button type="submit">Create Session</button>
      </form>

      <h2>View Session Attendance</h2>
      <form onSubmit={fetchAttendance}>
        <div className="form-row">
          <label htmlFor="attendanceSessionId">Session ID</label>
          <input
            id="attendanceSessionId"
            value={attendanceSessionId}
            onChange={(e) => setAttendanceSessionId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Fetch Attendance</button>
      </form>
      {attendance.length <= 0?(
        <p>No attendance records found for this session.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((r) => (
              <tr key={r._id}>
                <td>{r.studentId?.name}</td>
                <td>{r.studentId?.email}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

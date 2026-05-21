import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Student() {
  const { auth } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [joinForm, setJoinForm] = useState({ batchId: "", code: "" });
  const [msg, setMsg] = useState("");

  const [markedSessions, setMarkedSessions] = useState(new Set());

  const fetchSessions = () =>
    apiFetch("/sessions/active").then(setSessions).catch((err) => setMsg(err.message));

  const fetchBatches = () =>
    apiFetch("/batches/my").then(setBatches).catch((err) => setMsg(err.message));

  const fetchMarked = () =>
    apiFetch("/attendance/my")
      .then((records) => setMarkedSessions(new Set(records.map((r) => r.sessionId))))
      .catch(() => {});

  useEffect(() => {
    fetchSessions();
    fetchBatches();
    fetchMarked();
  }, []);

  const markAttendance = async (sessionId, status) => {
    try {
      await apiFetch("/attendance/mark", {
        method: "POST",
        body: JSON.stringify({ sessionId, status }),
      });
      setMarkedSessions((prev) => new Set(prev).add(sessionId));
      setMsg("Attendance marked!");
    } catch (err) {
      setMsg(err.message);
    }
  };

  const joinBatch = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch(`/batches/${joinForm.batchId}/join`, {
        method: "POST",
        body: JSON.stringify({ code: joinForm.code }),
      });
      setMsg(data.message);
      setJoinForm({ batchId: "", code: "" });
      fetchBatches();
      fetchSessions();
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <>
      <h1>Student Dashboard</h1>
      <p>Welcome, {auth.user?.name}</p>
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <h2>My Batches</h2>
      {batches.length === 0 ? (
        <p>You haven't joined any batch yet.</p>
      ) : (
        <ul>
          {batches.map((b) => (
            <li key={b._id}>
              {b.name} <small style={{ color: "gray" }}>({b._id})</small>
            </li>
          ))}
        </ul>
      )}

      <h2>Join Batch</h2>
      <form onSubmit={joinBatch}>
        <div className="form-row">
          <label htmlFor="batchId">Batch ID</label>
          <input
            id="batchId"
            value={joinForm.batchId}
            onChange={(e) => setJoinForm({ ...joinForm, batchId: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="inviteCode">Invite Code</label>
          <input
            id="inviteCode"
            value={joinForm.code}
            onChange={(e) => setJoinForm({ ...joinForm, code: e.target.value })}
            required
          />
        </div>
        <button type="submit">Join Batch</button>
      </form>

      <h2>Upcoming Sessions</h2>
      {sessions.length === 0 ? (
        <p>No upcoming sessions.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Title</th>
              <th>Batch</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Mark Attendance</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s._id}>
                <td>{s.title}</td>
                <td>{s.batchId?.name}</td>
                <td>{s.date}</td>
                <td>{s.startTime}</td>
                <td>{s.endTime}</td>
                <td>
                  {markedSessions.has(s._id) ? (
                    <span style={{ color: "green" }}>✓ Marked</span>
                  ) : (
                    <>
                      <button onClick={() => markAttendance(s._id, "present")}>Present</button>{" "}
                      <button onClick={() => markAttendance(s._id, "late")}>Late</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

// export default function Student() {
//     return (
//         <>
//             <h1>Student Dashboard</h1>
//             <p>Welcome to the student dashboard!</p>
//         </>
//     );
// }
import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Student() {
  const { auth } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [joinForm, setJoinForm] = useState({ batchId: "", code: "" });
  const [msg, setMsg] = useState("");

  const fetchBatches = () =>
    apiFetch("/batches/my")
      .then((data) => {
        console.log("Fetched batches:", data);
        setBatches(data);
      })
      .catch((err) => {
        console.log("Batches error:", err.message);
        setMsg(err.message);
      });
  
  const fetchSessions = () =>
    apiFetch("/sessions/active")
      .then((data) => {
        console.log("Fetched sessions:", data);
        setSessions(data);
      })
      .catch((err) => {
        console.log("Sessions error:", err.message);
        setMsg(err.message);
      });

  const debugAllSessions = () =>
    apiFetch("/sessions/all")
      .then((data) => {
        console.log("All sessions in database:", data);
        setMsg(`Found ${data.length} total sessions in database. Check console for details.`);
      })
      .catch((err) => {
        console.log("Debug sessions error:", err.message);
        setMsg(err.message);
      });
  useEffect(() => {
    fetchSessions();
    fetchBatches();
  }, []);

  const markAttendance = async (sessionId, status) => {
    try {
      await apiFetch("/attendance/mark", {
        method: "POST",
        body: JSON.stringify({ sessionId, status }),
      });
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
            onChange={(e) =>
              setJoinForm({ ...joinForm, batchId: e.target.value })
            }
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

      <h2>Today's Active Sessions</h2>
      <button onClick={debugAllSessions} style={{marginBottom: '10px', backgroundColor: '#f0f0f0'}}>Debug: Check All Sessions</button>
      {sessions.length === 0 ? (
        <p>No active sessions today.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Title</th>
              <th>Start</th>
              <th>End</th>
              <th>Mark Attendance</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s._id}>
                <td>{s.title}</td>
                <td>{s.startTime}</td>
                <td>{s.endTime}</td>
                <td>
                  <button onClick={() => markAttendance(s._id, "present")}>
                    Present
                  </button>{" "}
                  <button onClick={() => markAttendance(s._id, "late")}>
                    Late
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

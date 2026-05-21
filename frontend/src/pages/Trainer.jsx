import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Trainer() {
  const { auth } = useAuth();
  const [batches, setBatches] = useState([]);
  const [batch, setBatch] = useState({ name: "" });
  const [session, setSession] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    batchId: "",
  });
  const [sessions, setSessions] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [activeTab, setActiveTab] = useState("batches");

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const data = await apiFetch("/batches/my");
      setBatches(data);
    } catch (err) {
      setMsg(err.message);
      setMsgType("error");
    }
  };

  const createBatch = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch("/batches", {
        method: "POST",
        body: JSON.stringify({ name: batch.name }),
      });
      setMsg(`✓ Batch "${data.name}" created!`);
      setMsgType("success");
      setBatch({ name: "" });
      fetchBatches();
    } catch (err) {
      setMsg(err.message);
      setMsgType("error");
    }
  };

  const generateInvite = async (batchId) => {
    try {
      const data = await apiFetch(`/batches/${batchId}/invite`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      setInviteLink(data.inviteLink);
      const inviteCode = data.inviteLink.split("/").slice(-1)[0];
      setMsg(`✓ Invite code: ${inviteCode}`);
      setMsgType("success");
    } catch (err) {
      setMsg(err.message);
      setMsgType("error");
    }
  };

  const createSession = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch("/sessions", {
        method: "POST",
        body: JSON.stringify(session),
      });
      setMsg(`✓ Session "${data.title}" created!`);
      setMsgType("success");
      setSession({ title: "", date: "", startTime: "", endTime: "", batchId: "" });
    } catch (err) {
      setMsg(err.message);
      setMsgType("error");
    }
  };

  const fetchSessionsByBatch = async (batchId) => {
    try {
      const data = await apiFetch(`/sessions/batch/${batchId}`);
      setSessions(data);
      setSelectedSessionId("");
      setAttendance([]);
    } catch (err) {
      setMsg(err.message);
    }
  };

  const fetchAttendance = async (sessionId) => {
    try {
      const data = await apiFetch(`/sessions/${sessionId}/attendance`);
      setAttendance(data);
      setMsg("✓ Attendance loaded");
      setMsgType("success");
    } catch (err) {
      setMsg(err.message);
      setMsgType("error");
    }
  };

  const tabs = [
    { id: "batches", label: "📚 My Batches", icon: "📚" },
    { id: "create", label: "➕ Create Batch", icon: "➕" },
    { id: "sessions", label: "⏰ Create Session", icon: "⏰" },
    { id: "attendance", label: "✓ View Attendance", icon: "✓" },
  ];

  return (
    <div className="container">
      <h1>👨🏫 Trainer Dashboard</h1>
      <p style={{ fontSize: '1.1rem' }}>Welcome, <strong>{auth.user?.name}</strong></p>
      {msg && <div className={`alert alert-${msgType}`}>{msg}</div>}

      {/* Tab Navigation */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '0.75rem',
        marginBottom: '2rem'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '1rem',
              background: activeTab === tab.id ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : 'var(--bg-light)',
              color: activeTab === tab.id ? 'white' : 'var(--text)',
              border: '2px solid ' + (activeTab === tab.id ? 'var(--primary)' : 'var(--border)'),
              borderRadius: '0.75rem',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* My Batches Tab */}
      {activeTab === "batches" && (
        <div className="card">
          <h2>📚 My Batches</h2>
          {batches.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>No batches created yet</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {batches.map(b => (
                <div key={b._id} style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                  color: 'white',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{b.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
                      👥 {b.students?.length || 0} students
                    </p>
                  </div>
                  <button
                    onClick={() => generateInvite(b._id)}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '2px solid white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    🔗 Generate Invite
                  </button>
                </div>
              ))}
            </div>
          )}
          {inviteLink && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'var(--bg-light)',
              borderRadius: '0.75rem',
              border: '2px solid var(--success)'
            }}>
              <p style={{ margin: 0, marginBottom: '0.5rem', fontWeight: 600 }}>✓ Invite Link Generated:</p>
              <input
                type="text"
                value={inviteLink}
                readOnly
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border)',
                  marginBottom: '0.5rem',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem'
                }}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink);
                  setMsg("✓ Link copied to clipboard!");
                }}
                style={{ width: '100%', background: 'var(--success)' }}
              >
                📋 Copy Link
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Batch Tab */}
      {activeTab === "create" && (
        <div className="card">
          <h2>➕ Create New Batch</h2>
          <form onSubmit={createBatch}>
            <div className="form-row">
              <label htmlFor="batchName">Batch Name</label>
              <input
                id="batchName"
                value={batch.name}
                onChange={(e) => setBatch({ name: e.target.value })}
                placeholder="e.g., Python Batch 2024"
                required
              />
            </div>
            <button type="submit" style={{ width: '100%' }}>Create Batch</button>
          </form>
        </div>
      )}

      {/* Create Session Tab */}
      {activeTab === "sessions" && (
        <div className="card">
          <h2>⏰ Create Session</h2>
          <form onSubmit={createSession}>
            <div className="form-row">
              <label htmlFor="sessionTitle">Session Title</label>
              <input
                id="sessionTitle"
                value={session.title}
                onChange={(e) => setSession({ ...session, title: e.target.value })}
                placeholder="e.g., Lecture 1"
                required
              />
            </div>
            <div className="grid grid-2">
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
                <label htmlFor="sessionBatchId">Select Batch</label>
                <select
                  id="sessionBatchId"
                  value={session.batchId}
                  onChange={(e) => setSession({ ...session, batchId: e.target.value })}
                  required
                >
                  <option value="">Choose a batch...</option>
                  {batches.map(b => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-2">
              <div className="form-row">
                <label htmlFor="startTime">Start Time</label>
                <input
                  id="startTime"
                  type="time"
                  value={session.startTime}
                  onChange={(e) => setSession({ ...session, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <label htmlFor="endTime">End Time</label>
                <input
                  id="endTime"
                  type="time"
                  value={session.endTime}
                  onChange={(e) => setSession({ ...session, endTime: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" style={{ width: '100%' }}>Create Session</button>
          </form>
        </div>
      )}

      {/* View Attendance Tab */}
      {activeTab === "attendance" && (
        <div className="card">
          <h2>✓ View Attendance</h2>
          <div className="form-row">
            <label htmlFor="attendanceBatchId">Select Batch</label>
            <select
              id="attendanceBatchId"
              value={selectedBatchId}
              onChange={(e) => {
                setSelectedBatchId(e.target.value);
                if (e.target.value) fetchSessionsByBatch(e.target.value);
              }}
            >
              <option value="">Choose a batch...</option>
              {batches.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>
          {sessions.length > 0 && (
            <div className="form-row">
              <label htmlFor="attendanceSessionId">Select Session</label>
              <select
                id="attendanceSessionId"
                value={selectedSessionId}
                onChange={(e) => {
                  setSelectedSessionId(e.target.value);
                  if (e.target.value) fetchAttendance(e.target.value);
                }}
              >
                <option value="">Choose a session...</option>
                {sessions.map((s) => (
                  <option key={s._id} value={s._id}>{s.title} — {s.date}</option>
                ))}
              </select>
            </div>
          )}

          {attendance.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>No attendance records</p>
          ) : (
            <table style={{ marginTop: '1.5rem' }}>
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
                    <td>
                      <span className={`badge badge-${r.status === 'present' ? 'success' : r.status === 'late' ? 'warning' : 'danger'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

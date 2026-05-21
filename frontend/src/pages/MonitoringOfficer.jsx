import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function MonitoringOfficer() {
  const { auth } = useAuth();
  const [summary, setSummary] = useState(null);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  useEffect(() => {
    apiFetch("/attendance/programme/summary")
      .then(setSummary)
      .catch((err) => {
        setMsg(err.message);
        setMsgType("error");
      });
  }, []);

  return (
    <div className="container">
      <h1>Monitoring Officer Dashboard</h1>
      <p style={{ fontSize: '1.1rem' }}>Welcome, <strong>{auth.user?.name}</strong></p>
      {msg && <div className={`alert alert-${msgType}`}>{msg}</div>}

      <div className="card">
        <h2>Programme-wide Attendance Summary</h2>
        {summary ? (
          <div className="grid grid-2" style={{ marginTop: '2rem' }}>
            <div style={{ padding: '2rem', background: 'var(--bg-light)', borderRadius: '0.75rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Total Attendance</p>
              <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>{summary.total}</p>
            </div>
            <div style={{ padding: '2rem', background: 'var(--bg-light)', borderRadius: '0.75rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Present</p>
              <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success)' }}>{summary.present}</p>
            </div>
            <div style={{ padding: '2rem', background: 'var(--bg-light)', borderRadius: '0.75rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Late</p>
              <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--warning)' }}>{summary.late}</p>
            </div>
            <div style={{ padding: '2rem', background: 'var(--bg-light)', borderRadius: '0.75rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Absent</p>
              <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--danger)' }}>{summary.absent}</p>
            </div>
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Institution() {
  const { auth } = useAuth();
  const [batches, setBatches] = useState([]);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  useEffect(() => {
    apiFetch("/batches/institution")
      .then((data) => {
        setBatches(data);
      })
      .catch((err) => {
        setMsg(err.message);
        setMsgType("error");
      });
  }, []);

  return (
    <div className="container">
      <h1>Institution Dashboard</h1>
      <p style={{ fontSize: '1.1rem' }}>Welcome, <strong>{auth.user?.name}</strong></p>
      {msg && <div className={`alert alert-${msgType}`}>{msg}</div>}
      
      <h2>All Batches</h2>
      {batches.length === 0 ? (
        <p>No batches found.</p>
      ) : (
        <div className="grid grid-2">
          {batches.map((b) => (
            <div key={b._id} className="card">
              <h3>{b.name}</h3>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Trainers:</strong> <span className="badge badge-primary">{b.trainers?.length || 0}</span>
                </p>
                {b.trainers && b.trainers.length > 0 && (
                  <ul style={{ listStyle: 'none', padding: 0, marginLeft: '1rem' }}>
                    {b.trainers.map((t) => (
                      <li key={t._id} style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                        • {t.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Students:</strong> <span className="badge badge-success">{b.students?.length || 0}</span>
                </p>
                {b.students && b.students.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, marginLeft: '1rem' }}>
                    {b.students.map((s) => (
                      <li key={s._id} style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                        • {s.name} <br />
                        <small style={{ color: 'var(--text-light)', opacity: 0.7 }}>{s.email}</small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>No students yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

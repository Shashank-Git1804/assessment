import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function ProgramManager() {
  const { auth } = useAuth();
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [summary, setSummary] = useState(null);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  useEffect(() => {
    apiFetch("/institutions")
      .then(setInstitutions)
      .catch((err) => {
        setMsg(err.message);
        setMsgType("error");
      });
  }, []);

  const fetchSummary = async (institutionId) => {
    if (!institutionId) return;
    try {
      const data = await apiFetch(`/institutions/${institutionId}/summary`);
      setSummary(data);
      setMsg("✓ Summary fetched successfully");
      setMsgType("success");
    } catch (err) {
      setMsg(err.message);
      setMsgType("error");
    }
  };

  return (
    <div className="container">
      <h1>📊 Programme Manager Dashboard</h1>
      <p style={{ fontSize: '1.1rem' }}>Welcome, <strong>{auth.user?.name}</strong></p>
      {msg && <div className={`alert alert-${msgType}`}>{msg}</div>}

      <div className="grid grid-2">
        <div className="card">
          <h2>🏢 Select Institution</h2>
          <div className="form-row">
            <label htmlFor="institutionSelect">Choose Institution</label>
            <select
              id="institutionSelect"
              value={selectedInstitution}
              onChange={(e) => {
                setSelectedInstitution(e.target.value);
                fetchSummary(e.target.value);
              }}
            >
              <option value="">-- Select an institution --</option>
              {institutions.map((inst) => (
                <option key={inst._id} value={inst._id}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>
          
          {institutions.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
              No institutions found
            </p>
          ) : (
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', color: 'var(--text-light)' }}>
                All Institutions ({institutions.length})
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {institutions.map((inst) => (
                  <li key={inst._id} style={{
                    padding: '0.75rem',
                    background: 'var(--bg-light)',
                    borderRadius: '0.5rem',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                  }}>
                    <strong>{inst.name}</strong>
                    <br />
                    <small style={{ color: 'var(--text-light)' }}>{inst.email}</small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {summary && (
          <div className="card">
            <h2>📈 Attendance Summary</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                color: 'white',
                borderRadius: '0.75rem',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Total Attendance</p>
                <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800 }}>{summary.total}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, var(--success) 0%, #059669 100%)',
                  color: 'white',
                  borderRadius: '0.75rem',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>Present</p>
                  <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>{summary.present}</p>
                </div>
                <div style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, var(--warning) 0%, #d97706 100%)',
                  color: 'white',
                  borderRadius: '0.75rem',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>Late</p>
                  <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>{summary.late}</p>
                </div>
              </div>
              <div style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, var(--danger) 0%, #dc2626 100%)',
                color: 'white',
                borderRadius: '0.75rem',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>Absent</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>{summary.absent}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {summary && (
        <div className="card">
          <h2>📚 Batches</h2>
          {summary.batches && summary.batches.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {summary.batches.map((b) => (
                <div key={b._id} style={{
                  padding: '1.5rem',
                  background: 'var(--bg-light)',
                  borderRadius: '0.75rem',
                  border: '2px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{b.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)' }}>
                      👥 {b.students?.length || 0} students enrolled
                    </p>
                  </div>
                  <span className="badge badge-primary">{b.students?.length || 0}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '2rem' }}>No batches found for this institution</p>
          )}
        </div>
      )}
    </div>
  );
}

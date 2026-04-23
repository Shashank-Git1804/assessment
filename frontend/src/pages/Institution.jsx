// export default function Institution() {
//     return (
//         <>
//             <h1>Institution Dashboard</h1>
//             <p>Welcome to the institution dashboard!</p>
//         </>
//     );
// }

import { useState } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Institution() {
  const { auth } = useAuth();
  const [batchId, setBatchId] = useState("");
  const [summary, setSummary] = useState(null);
  const [msg, setMsg] = useState("");

  const fetchSummary = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch(`/batches/${batchId}/summary`);
      setSummary(data);
    } catch (err) { setMsg(err.message); }
  };

  return (
    <>
      <h1>Institution Dashboard</h1>
      <p>Welcome, {auth.user?.name}</p>
      {msg && <p style={{ color: "red" }}>{msg}</p>}

      <h2>Batch Summary</h2>
      <form onSubmit={fetchSummary}>
        <div className="form-row">
          <label htmlFor="batchId">Batch ID</label>
          <input id="batchId" value={batchId} onChange={(e) => setBatchId(e.target.value)} required />
        </div>
        <button type="submit">Get Summary</button>
      </form>
      {summary && (
        <div>
          <p><strong>Batch:</strong> {summary.name}</p>
          <p><strong>Students:</strong> {summary.students?.length}</p>
          <p><strong>Trainers:</strong> {summary.trainers?.length}</p>
          <h3>Students</h3>
          <ul>{summary.students?.map((s) => <li key={s._id}>{s.name} — {s.email}</li>)}</ul>
          <h3>Trainers</h3>
          <ul>{summary.trainers?.map((t) => <li key={t._id}>{t.name} — {t.email}</li>)}</ul>
        </div>
      )}
    </>
  );
}

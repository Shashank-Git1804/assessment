// export default function ProgramManager() {
//     return (
//         <>
//             <h1>Program Manager Dashboard</h1>
//             <p>Welcome to the program manager dashboard!</p>
//         </>
//     );
// }

import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function ProgramManager() {
  const { auth } = useAuth();
  const [institutions, setInstitutions] = useState([]);
  const [institutionId, setInstitutionId] = useState("");
  const [summary, setSummary] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    apiFetch("/institutions")
      .then(setInstitutions)
      .catch((err) => setMsg(err.message));
  }, []);

  const fetchSummary = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch(`/institutions/${institutionId}/summary`);
      setSummary(data);
    } catch (err) { setMsg(err.message); }
  };

  return (
    <>
      <h1>Programme Manager Dashboard</h1>
      <p>Welcome, {auth.user?.name}</p>
      {msg && <p style={{ color: "red" }}>{msg}</p>}

      <h2>Institutions</h2>
      {institutions.length === 0 ? (
        <p>No institutions found.</p>
      ) : (
        <ul>
          {institutions.map((inst) => (
            <li key={inst._id}>
              {inst.name} ({inst.email}) - ID: {inst._id}
            </li>
          ))}
        </ul>
      )}

      <h2>Institution Summary</h2>
      <form onSubmit={fetchSummary}>
        <div className="form-row">
          <label htmlFor="institutionId">Institution ID</label>
          <input id="institutionId" value={institutionId} onChange={(e) => setInstitutionId(e.target.value)} required />
        </div>
        <button type="submit">Get Summary</button>
      </form>
      {summary && (
        <div>
          <p>Total: {summary.total} | Present: {summary.present} | Late: {summary.late} | Absent: {summary.absent}</p>
          <h3>Batches</h3>
          <ul>{summary.batches?.map((b) => <li key={b._id}>{b.name} — {b.students?.length} students</li>)}</ul>
        </div>
      )}
    </>
  );
}

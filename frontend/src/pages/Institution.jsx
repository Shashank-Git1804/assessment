// export default function Institution() {
//     return (
//         <>
//             <h1>Institution Dashboard</h1>
//             <p>Welcome to the institution dashboard!</p>
//         </>
//     );
// }
import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Institution() {
  const { auth } = useAuth();
  const [batches, setBatches] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    apiFetch("/batches/institution")
      .then(setBatches)
      .catch((err) => setMsg(err.message));
  }, []);

  return (
    <>
      <h1>Institution Dashboard</h1>
      <p>Welcome, {auth.user?.name}</p>
      {msg && <p style={{ color: "red" }}>{msg}</p>}
      <h2>All Batches</h2>
      {batches.length === 0 ? (
        <p>No batches found.</p>
      ) : (
        batches.map((b) => (
          <div key={b._id} style={{ marginBottom: "1rem" }}>
            <h3>{b.name}</h3>
            <p><strong>Trainers:</strong> {b.trainers?.length === 0 ? "None" : b.trainers?.map((t) => t.name).join(", ")}</p>
            <p><strong>Students ({b.students?.length}):</strong></p>
            <ul>{b.students?.map((s) => <li key={s._id}>{s.name} — {s.email}</li>)}</ul>
          </div>
        ))
      )}
    </>
  );
}

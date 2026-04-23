// export default function MonitoringOfficer() {
//     return (
//         <>
//             <h1>Monitoring Officer Dashboard</h1>
//             <p>Welcome to the monitoring officer dashboard!</p>
//         </>
//     );
// }

import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function MonitoringOfficer() {
  const { auth } = useAuth();
  const [summary, setSummary] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    apiFetch("/attendance/programme/summary")
      .then(setSummary)
      .catch((err) => setMsg(err.message));
  }, []);

  return (
    <>
      <h1>Monitoring Officer Dashboard</h1>
      <p>Welcome, {auth.user?.name}</p>
      {msg && <p style={{ color: "red" }}>{msg}</p>}
      <h2>Programme-wide Attendance Summary</h2>
      {summary ? (
        <table border="1" cellPadding="8">
          <thead><tr><th>Total</th><th>Present</th><th>Late</th><th>Absent</th></tr></thead>
          <tbody>
            <tr>
              <td>{summary.total}</td>
              <td>{summary.present}</td>
              <td>{summary.late}</td>
              <td>{summary.absent}</td>
            </tr>
          </tbody>
        </table>
      ) : <p>Loading...</p>}
    </>
  );
}

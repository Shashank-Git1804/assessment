import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";

const roles = ["student", "trainer", "institution", "programme-manager", "monitoring-officer"];

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [value, setValue] = useState({ name: "", email: "", password: "", role: "", institutionId: "" });
  const [error, setError] = useState("");

  const handleOnChange = (e) => setValue({ ...value, [e.target.name]: e.target.value });

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { name: value.name, email: value.email, password: value.password, role: value.role };
      if (["student", "trainer", "institution", "programme-manager"].includes(value.role) && value.institutionId) {
        payload.institutionId = value.institutionId;
      }
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      login(data.token, data.user);
      navigate(`/${data.user.role}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container flex-center" style={{ minHeight: '100vh' }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
        <h1 style={{ textAlign: 'center', marginTop: 0 }}>Register</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleOnSubmit}>
          <div className="form-row">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={value.name} onChange={handleOnChange} placeholder="John Doe" required />
          </div>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={value.email} onChange={handleOnChange} placeholder="your@email.com" required />
          </div>
          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={value.password} onChange={handleOnChange} placeholder="••••••••" required />
          </div>
          <div className="form-row">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={value.role} onChange={handleOnChange} required>
              <option value="">Select Role</option>
              {roles.map((r) => <option key={r} value={r}>{r.replace("-", " ").toUpperCase()}</option>)}
            </select>
          </div>
          {value.role !== "monitoring-officer" && value.role && (
            <div className="form-row">
              <label htmlFor="institutionId">Institution ID (if applicable)</label>
              <input type="text" id="institutionId" name="institutionId" value={value.institutionId} onChange={handleOnChange} placeholder="Leave blank if not applicable" />
            </div>
          )}
          <button type="submit" style={{ width: '100%' }}>Register</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>Already Registered? <NavLink to="/">Login here</NavLink></p>
      </div>
    </div>
  );
}

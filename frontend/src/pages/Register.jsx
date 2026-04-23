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
    <>
      <h1>Register</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleOnSubmit}>
        <div className="form-row">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" value={value.name} onChange={handleOnChange} required />
        </div>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={value.email} onChange={handleOnChange} required />
        </div>
        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={value.password} onChange={handleOnChange} required />
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
            <input type="text" id="institutionId" name="institutionId" value={value.institutionId} onChange={handleOnChange} />
          </div>
        )}
        <button type="submit">Register</button>
      </form>
      <p>Already Registered? <NavLink to="/">Login here</NavLink></p>
    </>
  );
}

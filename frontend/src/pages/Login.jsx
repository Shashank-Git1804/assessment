import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [value, setValue] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleOnChange = (e) => setValue({ ...value, [e.target.name]: e.target.value });

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(value),
      });
      login(data.token, data.user);
      navigate(`/${data.user.role}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleOnSubmit}>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={value.email} onChange={handleOnChange} required />
        </div>
        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={value.password} onChange={handleOnChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>New User? <NavLink to="/register">Register here</NavLink></p>
    </>
  );
}

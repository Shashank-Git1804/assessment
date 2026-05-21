import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trainer from "./pages/Trainer";
import Student from "./pages/Student";
import Institution from "./pages/Institution";
import ProgramManager from "./pages/ProgramManager";
import MonitoringOfficer from "./pages/MonitoringOfficer";

export default function Preview() {
  const [currentPage, setCurrentPage] = useState("login");

  const pages = {
    login: { name: "Login", component: Login },
    register: { name: "Register", component: Register },
    trainer: { name: "Trainer Dashboard", component: Trainer },
    student: { name: "Student Dashboard", component: Student },
    institution: { name: "Institution Dashboard", component: Institution },
    manager: { name: "Programme Manager", component: ProgramManager },
    officer: { name: "Monitoring Officer", component: MonitoringOfficer },
  };

  const CurrentComponent = pages[currentPage].component;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <nav style={{
        background: "var(--primary)",
        padding: "1rem",
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap",
        boxShadow: "var(--shadow-lg)"
      }}>
        {Object.entries(pages).map(([key, page]) => (
          <button
            key={key}
            onClick={() => setCurrentPage(key)}
            style={{
              padding: "0.5rem 1rem",
              background: currentPage === key ? "var(--primary-dark)" : "rgba(255,255,255,0.2)",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 600,
              transition: "all 0.2s"
            }}
          >
            {page.name}
          </button>
        ))}
      </nav>

      <div style={{ padding: "2rem" }}>
        <CurrentComponent />
      </div>
    </div>
  );
}

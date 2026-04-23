// import { Outlet } from "react-router";

// export default function AppLayout() {
//   return (
//     <div>
//       <header>
//         <h1>My App</h1>
//       </header>
//       <hr />
//       <main>
//         <Outlet />
//       </main>
//       <hr />
//       <footer>
//         <p>&copy; 2026 My App. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

import { Outlet, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px" }}>
        <h1>Attendance System</h1>
        {auth.user && (
          <div>
            <span>{auth.user.name} ({auth.user.role})</span>{" "}
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>
      <hr />
      <main>
        <Outlet />
      </main>
      <hr />
      <footer><p>&copy; 2026 Attendance System. All rights reserved.</p></footer>
    </div>
  );
}


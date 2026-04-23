// import { useState } from "react";
// import { NavLink, useNavigate } from "react-router";

// export default function Register() {
// const navigate= useNavigate()
//   const roles = [
//     "student",
//     "trainer",
//     "institution",
//     "programme-manager",
//     "monitoring-officer",
//   ];
//   const [value, setValue] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "",
//     institutionId: '',
//     studentId: '',
//     trainerId: '',
//   });
//   const [error, setError] = useState('');

//   const handleOnChange = (e) => {
//     setValue({ ...value, [e.target.name]: e.target.value });
//   };
//   const handleOnSubmit = (e) => {
//     e.preventDefault();
//     const payLoad = {...value};
//     setError('');
//     try {
//         if(value.role === "trainer" && !value.trainerId){
//             throw new Error("Trainer ID is required for trainers");
//         }
//         if(value.role === "student" && !value.studentId){
//             throw new Error("Student ID is required for students");
//         }
//         if((value.role === "institution" || value.role === "programme-manager") && !value.institutionId){
//             throw new Error("Institution ID is required for institution and programme manager");
//         }
//         if(payLoad.role === "trainer"){
//             delete payLoad.studentId;
//             delete payLoad.institutionId;
//         }
//         if(payLoad.role === "student"){
//             delete payLoad.trainerId;
//             delete payLoad.institutionId;
//         }
//         if(payLoad.role === "institution" || payLoad.role === "programme-manager"){
//             delete payLoad.trainerId;
//             delete payLoad.studentId;
//         }
//         if(payLoad.role === "monitoring-officer"){
//             delete payLoad.trainerId;
//             delete payLoad.studentId;
//             delete payLoad.institutionId;

//         }
//         console.log(payLoad);
//         setValue({
//             name: "",
//             email: "",
//             password: "",
//             role: "",
//             institutionId: '',
//             studentId: '',
//             trainerId: '',
//         });
//         navigate(`/${value.role}`);

//     } catch (error) {
//         console.log(error)
//         setError(error)
//     }
//   };
//   return (
//     <>
//       <h1>register</h1>
//       {error && <p style={{color:"red"}}>{error.message}</p>}
//       <form onSubmit={handleOnSubmit}>
//         <input
//           type="text"
//           name="name"
//           id="name"
//           value={value.name}
//           onChange={handleOnChange}
//           required
//           placeholder="Full Name"
//         />
//         <input
//           type="email"
//           name="email"
//           id="email"
//           value={value.email}
//           onChange={handleOnChange}
//           required
//           placeholder="Email"
//         />
//         <input
//           type="password"
//           name="password"
//           id="password"
//           value={value.password}
//           onChange={handleOnChange}
//           required
//           placeholder="Password"
//         />
//         <select
//           name="role"
//           id="role"
//           value={value.role}
//           onChange={handleOnChange}
//           required
//         >
//           <option value="">Select Role</option>
//           {roles.map((role) => (
//             <option key={role} value={role}>
//               {role.replace("_", " ").toUpperCase()}
//             </option>
//           ))}
//         </select>
//         {value.role === "trainer" && (
//           <input
//             type="text"
//             name="trainerId"
//             id="trainerId"
//             value={value.trainerId}
//             onChange={handleOnChange}
//             required
//             placeholder="Trainer ID"
//           />
//         )}
//         {value.role === "student" && (
//           <input
//             type="text"
//             name="studentId"
//             id="studentId"
//             value={value.studentId}
//             onChange={handleOnChange}
//             required
//             placeholder="Student ID"
//           />
//         )}
//         {(value.role === "institution" || value.role === "programme-manager") && (
//           <input
//             type="text"
//             name="institutionId"
//             id="institutionId"
//             value={value.institutionId}
//             onChange={handleOnChange}
//             required
//             placeholder="Institution ID"
//           />
//         )}
//         <button type="submit">Register</button>
//       </form>
//       <p>
//         Already Registered? <NavLink to="/">Login here</NavLink>
//       </p>
//     </>
//   );
// }


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

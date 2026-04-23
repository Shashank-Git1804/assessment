// import "./App.css";
// import { createBrowserRouter, RouterProvider } from "react-router";
// import Register from "./pages/Register";
// import Login from "./pages/Login";
// import AppLayout from "./Layout/AppLayout";
// import MonitoringOfficer from "./pages/MonitoringOfficer";
// import ProgramManager from "./pages/ProgramManager";
// import Institution from "./pages/Institution";
// import Trainer from "./pages/Trainer";
// import Student from "./pages/Student";

// function App() {
//  return(

//   <RouterProvider router={createBrowserRouter([
//     {
//       path:'/',
//       element:<AppLayout/>,
//       children:[
//         {
//           path:'/',
//           element:<Login/>
//         },
//         {
//           path:"register",
//           element:<Register/>
//         },
//         {
//           path:"trainer",
//           element:<Trainer/>
//         },
//         {
//           path:"student",
//           element:<Student/>
//         },
//         {
//           path:"institution",
//           element:<Institution/>
//         },
//         {
//           path:"programme-manager",
//           element:<ProgramManager/>
//         },
//         {
//           path:"monitoring-officer",
//           element:<MonitoringOfficer/>

//         }
//       ]
//     }
//   ])}/>

//  )
// }

// export default App;

import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AppLayout from "./Layout/AppLayout";
import MonitoringOfficer from "./pages/MonitoringOfficer";
import ProgramManager from "./pages/ProgramManager";
import Institution from "./pages/Institution";
import Trainer from "./pages/Trainer";
import Student from "./pages/Student";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "trainer", element: <Trainer /> },
      { path: "student", element: <Student /> },
      { path: "institution", element: <Institution /> },
      { path: "programme-manager", element: <ProgramManager /> },
      { path: "monitoring-officer", element: <MonitoringOfficer /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;


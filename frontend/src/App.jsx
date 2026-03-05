import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ManageDepartments from "./pages/admin/ManageDepartments";
import ManageUsers from "./pages/admin/ManageUsers";
import StudentDashboard from "./pages/student/StudentDashboard";
import UploadAssignment from "./pages/student/UploadAssignment";
import ProfessorDashboard from "./pages/professor/ProfessorDashboard";
import HodDashboard from "./pages/hod/HodDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/departments"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ManageDepartments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        {/* Student */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/upload"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <UploadAssignment />
            </ProtectedRoute>
          }
        />

        {/* Professor */}
        <Route
          path="/professor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["PROFESSOR"]}>
              <ProfessorDashboard />
            </ProtectedRoute>
          }
        />

        {/* HOD */}
        <Route
          path="/hod/dashboard"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <HodDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

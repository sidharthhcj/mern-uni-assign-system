import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

const API = import.meta.env.VITE_API_URL;

const sidebarItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
  { label: "Departments", path: "/admin/departments", icon: "🏢" },
  { label: "Users", path: "/admin/users", icon: "👥" },
];

function AdminDashboard() {
  const [data, setData] = useState({
    departments: 0,
    assignments: 0,
    students: 0,
    professors: 0,
    hods: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const users = res.data.usersCount;
        const getCount = (role) =>
          users.find((u) => u._id === role)?.count || 0;

        setData({
          departments: res.data.totalDepartments,
          assignments: res.data.totalAssignments || 0,
          students: getCount("STUDENT"),
          professors: getCount("PROFESSOR"),
          hods: getCount("HOD"),
        });
      })
      .catch(() => { });
  }, []);

  return (
    <DashboardLayout title="Admin Dashboard" role="ADMIN" sidebarItems={sidebarItems}>
      <h2 className="page-title">Dashboard Overview</h2>
      <div className="stats-grid">
        <StatCard title="Departments" value={data.departments} color="blue" icon="🏢" />
        <StatCard title="Assignments" value={data.assignments} color="teal" icon="📄" />
        <StatCard title="Students" value={data.students} color="green" icon="🎓" />
        <StatCard title="Professors" value={data.professors} color="orange" icon="👨‍🏫" />
        <StatCard title="HODs" value={data.hods} color="purple" icon="👤" />
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card-icon">{icon}</div>
      <div>
        <p className="stat-card-label">{title}</p>
        <h3 className="stat-card-value">{value}</h3>
      </div>
    </div>
  );
}

export default AdminDashboard;

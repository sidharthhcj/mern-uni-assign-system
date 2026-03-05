import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const API = import.meta.env.VITE_API_URL;

const sidebarItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { label: "Departments", path: "/admin/departments", icon: "🏢" },
    { label: "Users", path: "/admin/users", icon: "👥" },
];

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "STUDENT",
        department: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchUsers = () => {
        axios
            .get(`${API}/admin/users`, { headers })
            .then((res) => setUsers(res.data))
            .catch(() => { });
    };

    const fetchDepartments = () => {
        axios
            .get(`${API}/admin/departments`, { headers })
            .then((res) => setDepartments(res.data))
            .catch(() => { });
    };

    useEffect(() => {
        fetchUsers();
        fetchDepartments();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await axios.post(`${API}/admin/user`, form, { headers });
            setSuccess("User created!");
            setForm({ name: "", email: "", password: "", role: "STUDENT", department: "" });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || "Error creating user");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            await axios.delete(`${API}/admin/user/${id}`, { headers });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || "Error deleting user");
        }
    };

    const roleBadgeClass = (role) => {
        const map = {
            ADMIN: "badge badge--red",
            STUDENT: "badge badge--green",
            PROFESSOR: "badge badge--orange",
            HOD: "badge badge--purple",
        };
        return map[role] || "badge";
    };

    return (
        <DashboardLayout title="Admin Dashboard" role="ADMIN" sidebarItems={sidebarItems}>
            <h2 className="page-title">Manage Users</h2>

            {/* Add form */}
            <div className="card mb-6">
                <h3 className="card-title">Add New User</h3>
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleAdd} className="form-grid">
                    <div className="form-group">
                        <label>Name</label>
                        <input name="name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select name="role" value={form.role} onChange={handleChange}>
                            <option value="STUDENT">Student</option>
                            <option value="PROFESSOR">Professor</option>
                            <option value="HOD">HOD</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Department</label>
                        <select name="department" value={form.department} onChange={handleChange} required>
                            <option value="">Select department</option>
                            {departments.map((d) => (
                                <option key={d._id} value={d._id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group form-group--action">
                        <button type="submit" className="btn btn-primary">Create User</button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="card">
                <h3 className="card-title">All Users ({users.length})</h3>
                {users.length === 0 ? (
                    <p className="text-muted">No users yet.</p>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Department</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u, i) => (
                                    <tr key={u._id}>
                                        <td>{i + 1}</td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={roleBadgeClass(u.role)}>{u.role}</span>
                                        </td>
                                        <td>{u.department?.name || "—"}</td>
                                        <td>
                                            {u.role !== "ADMIN" && (
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(u._id)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default ManageUsers;

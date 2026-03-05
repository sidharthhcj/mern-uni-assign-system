import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const API = import.meta.env.VITE_API_URL;

const sidebarItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { label: "Departments", path: "/admin/departments", icon: "🏢" },
    { label: "Users", path: "/admin/users", icon: "👥" },
];

function ManageDepartments() {
    const [departments, setDepartments] = useState([]);
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchDepartments = () => {
        axios
            .get(`${API}/admin/departments`, { headers })
            .then((res) => setDepartments(res.data))
            .catch(() => { });
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await axios.post(`${API}/admin/department`, { name }, { headers });
            setSuccess("Department created!");
            setName("");
            fetchDepartments();
        } catch (err) {
            setError(err.response?.data?.message || "Error creating department");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this department?")) return;
        try {
            await axios.delete(`${API}/admin/department/${id}`, { headers });
            fetchDepartments();
        } catch (err) {
            setError(err.response?.data?.message || "Error deleting department");
        }
    };

    return (
        <DashboardLayout title="Admin Dashboard" role="ADMIN" sidebarItems={sidebarItems}>
            <h2 className="page-title">Manage Departments</h2>

            {/* Add form */}
            <div className="card mb-6">
                <h3 className="card-title">Add New Department</h3>
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleAdd} className="inline-form">
                    <input
                        type="text"
                        placeholder="Department name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-primary">Add</button>
                </form>
            </div>

            {/* List */}
            <div className="card">
                <h3 className="card-title">All Departments ({departments.length})</h3>
                {departments.length === 0 ? (
                    <p className="text-muted">No departments yet.</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((d, i) => (
                                <tr key={d._id}>
                                    <td>{i + 1}</td>
                                    <td>{d.name}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(d._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
}

export default ManageDepartments;

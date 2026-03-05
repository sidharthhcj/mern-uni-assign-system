import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const API = import.meta.env.VITE_API_URL;

const sidebarItems = [
    { label: "My Assignments", path: "/student/dashboard", icon: "📄" },
    { label: "Upload New", path: "/student/upload", icon: "📤" },
];

function StudentDashboard() {
    const [assignments, setAssignments] = useState([]);
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchAssignments = () => {
        axios
            .get(`${API}/student/assignments`, { headers })
            .then((res) => setAssignments(res.data))
            .catch(() => { });
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const handleSubmit = async (id) => {
        try {
            await axios.put(`${API}/student/assignment/${id}/submit`, {}, { headers });
            fetchAssignments();
        } catch (err) {
            alert(err.response?.data?.message || "Error submitting");
        }
    };

    const handleResubmit = async (id) => {
        // For resubmit, we use a file input
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pdf,.doc,.docx,.txt,.ppt,.pptx,.zip";
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const formData = new FormData();
            formData.append("file", file);
            try {
                await axios.put(`${API}/student/assignment/${id}/resubmit`, formData, {
                    headers: { ...headers, "Content-Type": "multipart/form-data" },
                });
                fetchAssignments();
            } catch (err) {
                alert(err.response?.data?.message || "Error resubmitting");
            }
        };
        input.click();
    };

    const statusBadge = (status) => {
        const map = {
            DRAFT: "badge badge--gray",
            SUBMITTED: "badge badge--blue",
            UNDER_REVIEW: "badge badge--orange",
            FORWARDED_TO_HOD: "badge badge--purple",
            APPROVED: "badge badge--green",
            REJECTED: "badge badge--red",
        };
        return map[status] || "badge";
    };

    return (
        <DashboardLayout title="Student Portal" role="STUDENT" sidebarItems={sidebarItems}>
            <h2 className="page-title">My Assignments</h2>

            {assignments.length === 0 ? (
                <div className="card">
                    <p className="text-muted">No assignments yet. Upload your first assignment!</p>
                </div>
            ) : (
                <div className="card">
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Department</th>
                                    <th>Status</th>
                                    <th>Feedback</th>
                                    <th>File</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.map((a, i) => (
                                    <tr key={a._id}>
                                        <td>{i + 1}</td>
                                        <td>
                                            <strong>{a.title}</strong>
                                            {a.description && (
                                                <p className="text-muted text-sm">{a.description}</p>
                                            )}
                                        </td>
                                        <td>{a.department?.name || "—"}</td>
                                        <td>
                                            <span className={statusBadge(a.status)}>
                                                {a.status.replace(/_/g, " ")}
                                            </span>
                                        </td>
                                        <td>
                                            {a.professorFeedback && (
                                                <p className="text-sm">
                                                    <strong>Prof:</strong> {a.professorFeedback}
                                                </p>
                                            )}
                                            {a.hodFeedback && (
                                                <p className="text-sm">
                                                    <strong>HOD:</strong> {a.hodFeedback}
                                                </p>
                                            )}
                                            {!a.professorFeedback && !a.hodFeedback && "—"}
                                        </td>
                                        <td>
                                            {a.filePath ? (
                                                <a
                                                    href={`${API}/uploads/${a.filePath}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="link"
                                                >
                                                    📎 View
                                                </a>
                                            ) : (
                                                "—"
                                            )}
                                        </td>
                                        <td>
                                            {a.status === "DRAFT" && (
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleSubmit(a._id)}
                                                >
                                                    Submit
                                                </button>
                                            )}
                                            {a.status === "REJECTED" && (
                                                <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() => handleResubmit(a._id)}
                                                >
                                                    Resubmit
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default StudentDashboard;

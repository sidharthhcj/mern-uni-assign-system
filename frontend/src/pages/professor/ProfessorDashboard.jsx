import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const API = import.meta.env.VITE_API_URL;

const sidebarItems = [
    { label: "Assignments", path: "/professor/dashboard", icon: "📄" },
];

function ProfessorDashboard() {
    const [assignments, setAssignments] = useState([]);
    const [feedbackMap, setFeedbackMap] = useState({});
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchAssignments = () => {
        axios
            .get(`${API}/professor/assignments`, { headers })
            .then((res) => setAssignments(res.data))
            .catch(() => { });
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const handleReview = async (id, action) => {
        try {
            await axios.put(
                `${API}/professor/assignment/${id}/review`,
                { action, feedback: feedbackMap[id] || "" },
                { headers }
            );
            setFeedbackMap({ ...feedbackMap, [id]: "" });
            fetchAssignments();
        } catch (err) {
            alert(err.response?.data?.message || "Error processing review");
        }
    };

    return (
        <DashboardLayout title="Professor Portal" role="PROFESSOR" sidebarItems={sidebarItems}>
            <h2 className="page-title">Submitted Assignments</h2>

            {assignments.length === 0 ? (
                <div className="card">
                    <p className="text-muted">No assignments pending review.</p>
                </div>
            ) : (
                <div className="assignments-list">
                    {assignments.map((a) => (
                        <div key={a._id} className="card mb-4">
                            <div className="card-row">
                                <div className="card-info">
                                    <h3 className="card-item-title">{a.title}</h3>
                                    {a.description && (
                                        <p className="text-muted text-sm">{a.description}</p>
                                    )}
                                    <p className="text-sm">
                                        <strong>Student:</strong> {a.student?.name} ({a.student?.email})
                                    </p>
                                    <p className="text-sm">
                                        <strong>Department:</strong> {a.department?.name}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Status:</strong>{" "}
                                        <span className="badge badge--blue">
                                            {a.status.replace(/_/g, " ")}
                                        </span>
                                    </p>
                                    {a.filePath && (
                                        <a
                                            href={`${API}/uploads/${a.filePath}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="link"
                                        >
                                            📎 Download File
                                        </a>
                                    )}
                                </div>
                                <div className="card-actions">
                                    <textarea
                                        placeholder="Write feedback (optional)..."
                                        value={feedbackMap[a._id] || ""}
                                        onChange={(e) =>
                                            setFeedbackMap({ ...feedbackMap, [a._id]: e.target.value })
                                        }
                                        rows={2}
                                    />
                                    <div className="btn-group">
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleReview(a._id, "approve")}
                                        >
                                            ✅ Approve & Forward to HOD
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleReview(a._id, "reject")}
                                        >
                                            ❌ Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}

export default ProfessorDashboard;

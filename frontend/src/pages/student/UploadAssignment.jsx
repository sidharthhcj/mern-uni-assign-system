import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

const API = import.meta.env.VITE_API_URL;

const sidebarItems = [
    { label: "My Assignments", path: "/student/dashboard", icon: "📄" },
    { label: "Upload New", path: "/student/upload", icon: "📤" },
];

function UploadAssignment() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const handleUpload = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            if (file) formData.append("file", file);

            await axios.post(`${API}/student/assignment`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate("/student/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Error uploading assignment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="Student Portal" role="STUDENT" sidebarItems={sidebarItems}>
            <h2 className="page-title">Upload New Assignment</h2>

            <div className="card" style={{ maxWidth: 600 }}>
                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleUpload}>
                    <div className="form-group">
                        <label>Assignment Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Data Structures Lab 5"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description (optional)</label>
                        <textarea
                            placeholder="Brief description of your assignment..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label>Upload File</label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.zip"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <p className="text-muted text-sm">
                            Accepted: PDF, DOC, DOCX, TXT, PPT, PPTX, ZIP (max 10MB)
                        </p>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Uploading..." : "Upload as Draft"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/student/dashboard")}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}

export default UploadAssignment;

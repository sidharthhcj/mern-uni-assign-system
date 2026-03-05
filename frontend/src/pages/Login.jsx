import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await axios.post(`${API}/auth/login`, { email, password });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("userName", res.data.name);
            if (res.data.department) {
                localStorage.setItem("department", JSON.stringify(res.data.department));
            }

            // Route based on role
            switch (res.data.role) {
                case "ADMIN":
                    navigate("/admin/dashboard");
                    break;
                case "STUDENT":
                    navigate("/student/dashboard");
                    break;
                case "PROFESSOR":
                    navigate("/professor/dashboard");
                    break;
                case "HOD":
                    navigate("/hod/dashboard");
                    break;
                default:
                    navigate("/");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">🎓</div>
                    <h1>University Portal</h1>
                    <p>Assignment Approval System</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="your@university.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="login-footer-text">
                    Contact your administrator for account access
                </p>
            </div>
        </div>
    );
}

export default Login;

import { useNavigate } from "react-router-dom";

function DashboardLayout({ title, role, sidebarItems, children }) {
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName") || "User";

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="dashboard-layout">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-left">
                    <span className="header-icon">🎓</span>
                    <h1>{title}</h1>
                </div>
                <div className="header-right">
                    <span className="header-user">
                        <span className="user-badge">{role}</span>
                        {userName}
                    </span>
                    <button onClick={handleLogout} className="btn btn-logout">
                        Logout
                    </button>
                </div>
            </header>

            <div className="dashboard-body">
                {/* Sidebar */}
                <aside className="dashboard-sidebar">
                    <p className="sidebar-label">Navigation</p>
                    <nav className="sidebar-nav">
                        {sidebarItems.map((item) => (
                            <div
                                key={item.label}
                                className="sidebar-item"
                                onClick={() => navigate(item.path)}
                            >
                                <span className="sidebar-item-icon">{item.icon}</span>
                                {item.label}
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main content */}
                <main className="dashboard-main">{children}</main>
            </div>

            {/* Footer */}
            <footer className="dashboard-footer">
                © 2025 University Assignment Approval System
            </footer>
        </div>
    );
}

export default DashboardLayout;

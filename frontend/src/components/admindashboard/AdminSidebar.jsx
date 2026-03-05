import { useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-slate-800 text-slate-200 min-h-full px-4 py-6">
      
      <p className="text-xs uppercase tracking-wider text-slate-400 mb-6">
        Navigation
      </p>

      <nav className="space-y-2">
        <Item label="Departments" onClick={() => navigate("/admin/departments")} />
        <Item label="Users" onClick={() => navigate("/admin/users")} />
        <Item label="Add User" onClick={() => navigate("/admin/add-user")} />
      </nav>
    </aside>
  );
}

export default AdminSidebar;

function Item({ label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="px-4 py-2 rounded-md cursor-pointer
                 hover:bg-slate-700 transition"
    >
      {label}
    </div>
  );
}

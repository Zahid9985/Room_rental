import { useState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getApiMessage } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export const AdminLoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("admin@ssrooms.local");
  const [password, setPassword] = useState("Admin@12345");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      addToast("Welcome back.", "success");
      navigate((location.state as { from?: string } | null)?.from || "/admin/dashboard", { replace: true });
    } catch (error) {
      addToast(getApiMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-login-page">
      <div className="login-card">
        <div className="login-icon"><LockKeyhole size={28} /></div>
        <p className="eyebrow">Admin</p>
        <h1>SS Room Rentals</h1>
        <form onSubmit={submit} className="stacked-form">
          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
          </label>
          <label className="field">
            <span>Password</span>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
          </label>
          <button className="primary-button full-width" disabled={loading}>
            <LogIn size={18} />
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

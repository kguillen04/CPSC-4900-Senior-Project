import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(stored));
    } catch {
      // corrupted storage -> reset
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  if (!user) return null;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Dashboard</h2>

      <div
        style={{
          marginTop: 16,
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <p><b>Email:</b> {user.email}</p>
        <p><b>User ID:</b> {user.userId}</p>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <button onClick={handleLogout} style={{ padding: 10 }}>
          Log out
        </button>

        {/* placeholders for later */}
        <Link to="/quiz" style={{ padding: 10, border: "1px solid #ddd", borderRadius: 6 }}>
          Start Quiz (coming soon)
        </Link>
      </div>

      <div
        style={{
          marginTop: 24,
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 8,
        }}
      >
        <p><b>Mastery (placeholder)</b></p>
        <ul style={{ marginTop: 8 }}>
          <li>Variables: 0.5</li>
          <li>Conditionals: 0.5</li>
          <li>Loops: 0.5</li>
        </ul>
      </div>
    </div>
  );
}
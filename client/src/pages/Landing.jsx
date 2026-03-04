import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: "center", marginTop: 80, fontFamily: "sans-serif" }}>
        <h1>Adaptive Learning Platform</h1>

        <p style={{ marginTop: 12 }}>
            Improve your programming skills with adaptive quizzes.
        </p>

        <div style={{ marginTop: 30, display: "flex", gap: 16, justifyContent: "center" }}>
            <button
            onClick={() => navigate("/login")}
            style={{ padding: 12, fontSize: 16 }}
            >
            Login
            </button>

            <button
            onClick={() => navigate("/register")}
            style={{ padding: 12, fontSize: 16 }}
            >
            Register
            </button>
        </div>
        </div>
    );
}
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { postJSON } from "../api.js"

export default function Register({ onAuth }) {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await postJSON("/api/auth/register", { email, password });
            
            localStorage.setItem(
                "user",
                JSON.stringify({ 
                    userId: data.userId,
                    email: email,
                })
            );

            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "sans-serif" }}>
        <h2>Register</h2>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            <label>
            Email
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                style={{ width: "100%", padding: 10, marginTop: 6 }}
            />
            </label>

            <label>
            Password
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                minLength={6}
                style={{ width: "100%", padding: 10, marginTop: 6 }}
            />
            </label>

            <button disabled={loading} style={{ padding: 10 }}>
            {loading ? "Creating..." : "Create account"}
            </button>

            {error && <div style={{ color: "crimson" }}>{error}</div>}
        </form>
        </div>
    );
}


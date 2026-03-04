import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJSON } from "../api";

export default function Quiz() {
    const navigate = useNavigate();

    const [question, setQuestion] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const [loading, setLoading] = useState(null);
    const [error, setError] = useState("");

    // hardcoding for now, but we will make it adaptive later
    const concept = "variables";
    const difficulty = 2;

    async function loadQuestion() {
        setLoading(true);
        setError("");
        setSelectedIndex(null);

        try {
            const q = await getJSON(
                `/api/questions/next?concept=${encodeURIComponent(concept)}&difficulty=${difficulty}`
            );
            setQuestion(q);
        } catch (err) {
            setError(err.message);
            setQuestion(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) {
            navigate("/login");
            return;
        }

        loadQuestion();
    }, []);

    if (loading) {
        return <div style={{ maxWidth: 700, margin: "40px auto" }}>Loading question...</div>;
    }

    if (error) {
        return (
        <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
            <h2>Quiz</h2>
            <p style={{ color: "crimson" }}>{error}</p>
            <button onClick={loadQuestion} style={{ padding: 10, marginTop: 10 }}>
            Try again
            </button>
        </div>
        );
    }

    if (!question) return null;

    return (
        <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
        <h2>Quiz</h2>

        <div style={{ marginTop: 12, color: "#555" }}>
            <b>Concept:</b> {question.concept} &nbsp; | &nbsp;
            <b>Difficulty:</b> {question.difficulty}
        </div>

        <div
            style={{
            marginTop: 16,
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 8,
            whiteSpace: "pre-wrap",
            }}
        >
            {question.prompt}
        </div>

        <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
            {question.choices.map((choice, idx) => (
            <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                style={{
                padding: 12,
                textAlign: "left",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: selectedIndex === idx ? "#f3f4f6" : "white",
                cursor: "pointer",
                }}
            >
                {choice}
            </button>
            ))}
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button onClick={loadQuestion} style={{ padding: 10 }}>
            Next question
            </button>

            <button
            disabled={selectedIndex === null}
            onClick={() => alert(`Selected choice index: ${selectedIndex}`)}
            style={{ padding: 10 }}
            >
            Submit (placeholder)
            </button>
        </div>
        </div>
    );
}
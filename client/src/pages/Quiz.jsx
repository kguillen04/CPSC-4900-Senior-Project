import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJSON, postJSON } from "../api";

export default function Quiz() {
    const navigate = useNavigate();

    const [question, setQuestion] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [feedback, setFeedback] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // hardcoding for now, but we will make it adaptive later
    const concept = "variables";
    const difficulty = 2;

    async function loadQuestion() {
        setLoading(true);
        setError("");
        setSelectedIndex(null);
        setFeedback(null);

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

    async function handleSubmit() {
        if (selectedIndex == null || !question?._id) return;

        setSubmitting(true);
        setError("");

        try {
            const stored = JSON.parse(localStorage.getItem("user") || "null");
            if (!stored?.userId) {
                navigate("/login");
                return;
            }

            const result = await postJSON("/api/attempts", {
                userId: stored.userId,
                questionId: question._id,
                selectedIndex,
            });

            setFeedback(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
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

    const answered = feedback !== null;

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
            {question.choices.map((choice, idx) => {
            const isSelected = selectedIndex === idx;
            const isCorrectChoice = answered && feedback?.correctIndex === idx;
            const isWrongSelected = answered && isSelected && !feedback?.correct;

            let background = "white";
            if (isSelected) background = "#f3f4f6";
            if (isCorrectChoice) background = "#dcfce7"; // light green
            if (isWrongSelected) background = "#fee2e2"; // light red

            return (
                <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                disabled={answered}
                style={{
                    padding: 12,
                    textAlign: "left",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    background,
                    cursor: answered ? "default" : "pointer",
                }}
                >
                {choice}
                </button>
            );
            })}
        </div>

        {feedback && (
            <div
            style={{
                marginTop: 16,
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 8,
            }}
            >
            <div style={{ fontWeight: "bold" }}>
                {feedback.correct ? "Correct!" : "Incorrect"}
            </div>
            {feedback.explanation && (
                <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                {feedback.explanation}
                </div>
            )}
            </div>
        )}

        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button onClick={loadQuestion} style={{ padding: 10 }}>
            Next question
            </button>

            <button
            disabled={selectedIndex === null || submitting || answered}
            onClick={handleSubmit}
            style={{ padding: 10 }}
            >
            {submitting ? "Submitting..." : answered ? "Submitted" : "Submit"}
            </button>
        </div>
        </div>
    );
}
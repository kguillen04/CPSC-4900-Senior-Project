import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJSON, postJSON } from "../api";
import Navbar from "../components/Navbar";

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
        return (
        <div className="min-h-screen bg-page">
            <div className="flex min-h-screen flex-col bg-white">
            <Navbar />
            <div className="flex flex-1 items-center justify-center text-xl text-black/70">
                Loading question...
            </div>
            </div>
        </div>
        );
    }

    if (error && !question) {
        return (
        <div className="min-h-screen bg-page">
            <div className="flex min-h-screen flex-col bg-white">
            <Navbar />
            <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-8 py-12">
                <h1 className="text-4xl font-semibold">Quiz</h1>
                <p className="mt-4 text-red-600">{error}</p>
                <button
                onClick={loadQuestion}
                className="mt-6 w-fit rounded-xl bg-primary px-5 py-3 text-lg font-medium transition hover:bg-primary-dark"
                >
                Try again
                </button>
            </main>
            </div>
        </div>
        );
    }

    if (!question) return null;

    const answered = feedback !== null;

    return (
        <div className="min-h-screen bg-page">
        <div className="flex min-h-screen flex-col bg-white">
            <Navbar />

            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-8 py-10">
            <section className="mx-auto w-full max-w-4xl">
                <h1 className="text-center text-5xl font-semibold capitalize tracking-tight">
                {question.concept}
                </h1>

                <div className="mt-10">
                <p className="whitespace-pre-wrap text-xl leading-8 text-black/85">
                    {question.prompt}
                </p>
                </div>

                <div className="mt-8">
                <h2 className="text-2xl font-semibold">Select 1 answer:</h2>

                <div className="mt-4">
                   {question.choices.map((choice, idx) => {
                    const isSelected = selectedIndex === idx;
                    const isCorrectSelected = answered && feedback?.correct && isSelected;
                    const isWrongSelected = answered && !feedback?.correct && isSelected;

                    let rowClasses =
                        "flex w-full items-center gap-4 border-t border-black/25 px-0 py-5 text-left transition";

                    if (!answered && isSelected) {
                        rowClasses += " bg-primary/15";
                    }

                    if (isCorrectSelected) {
                        rowClasses += " bg-green-100";
                    }

                    if (isWrongSelected) {
                        rowClasses += " bg-neutral-200";
                    }

                    return (
                        <button
                        key={idx}
                        onClick={() => setSelectedIndex(idx)}
                        disabled={answered}
                        className={rowClasses}
                        >
                        <div className="ml-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-medium text-black">
                            {String.fromCharCode(65 + idx)}
                        </div>

                        <span className="text-xl text-black/85">{choice}</span>
                        </button>
                    );
                    })}

                    <div className="border-t border-black/25" />
                </div>
                </div>

                {error && question && (
                <div className="mt-6 text-sm text-red-600">{error}</div>
                )}

                {feedback && (
                    <div className="mt-8 rounded-2xl border border-black/15 bg-neutral-50 p-5">
                        <div className="text-xl font-semibold">
                        {feedback.correct ? "Correct!" : "Not quite."}
                        </div>

                        {feedback.correct && feedback.explanation && (
                        <p className="mt-3 whitespace-pre-wrap text-lg leading-7 text-black/75">
                            {feedback.explanation}
                        </p>
                        )}
                    </div>
                )}
            </section>
            </main>

            <footer className="border-t border-primary/40 px-8 py-4">
            <div className="mx-auto flex max-w-5xl items-center justify-end gap-6">
                <button
                onClick={loadQuestion}
                className="text-xl font-medium text-primary-dark transition hover:opacity-80"
                >
                Skip
                </button>

                <button
                    disabled={submitting || (!answered && selectedIndex === null)}
                    onClick={() => {
                        if (answered) {
                        loadQuestion();
                        } else {
                        handleSubmit();
                        }
                    }}
                    className="rounded-xl bg-primary px-7 py-2.5 text-xl font-medium text-black transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? "Checking..." : answered ? "Next" : "Check"}
                </button>
            </div>
            </footer>
        </div>
        </div>
    );
}
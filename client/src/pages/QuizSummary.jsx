import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function QuizSummary() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    concept = "concept",
    totalQuestions = 10,
    questionsCorrect = 0,
    startMastery = null,
    endMastery = null,
  } = location.state || {};

  const accuracy =
    totalQuestions > 0 ? Math.round((questionsCorrect / totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen bg-page">
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />

        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-8 py-12">
          <h1 className="text-center text-5xl font-semibold capitalize tracking-tight">
            {concept} Summary
          </h1>

          <div className="mt-10 rounded-3xl border border-black/10 bg-neutral-50 p-8 shadow-sm">
            <div className="grid gap-6 text-lg text-black/80 sm:grid-cols-2">
              <div>
                <div className="text-sm uppercase tracking-wide text-black/50">
                  Questions Answered
                </div>
                <div className="mt-1 text-3xl font-semibold">{totalQuestions}</div>
              </div>

              <div>
                <div className="text-sm uppercase tracking-wide text-black/50">
                  Correct Answers
                </div>
                <div className="mt-1 text-3xl font-semibold">
                  {questionsCorrect} / {totalQuestions}
                </div>
              </div>

              <div>
                <div className="text-sm uppercase tracking-wide text-black/50">
                  Accuracy
                </div>
                <div className="mt-1 text-3xl font-semibold">{accuracy}%</div>
              </div>

              <div>
                <div className="text-sm uppercase tracking-wide text-black/50">
                  Mastery Change
                </div>
                <div className="mt-1 text-3xl font-semibold">
                  {startMastery !== null ? Number(startMastery).toFixed(3) : "—"}{" "}
                  →{" "}
                  {endMastery !== null ? Number(endMastery).toFixed(3) : "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate(`/quiz?concept=${encodeURIComponent(concept)}`)}
              className="rounded-xl bg-primary px-6 py-3 text-lg font-medium text-black transition hover:bg-primary-dark"
            >
              Retake Quiz
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl border border-black/15 px-6 py-3 text-lg font-medium text-black transition hover:bg-black/5"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
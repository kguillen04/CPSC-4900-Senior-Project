import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState("concepts");

  const concepts = [
    { name: "Variables", progress: 0 },
    { name: "Conditionals", progress: 0 },
    { name: "Loops", progress: 0 },
  ];

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

  if (!user) return null;

  function renderProgressBar(progress) {
    return (
      <div className="mt-3 h-5 w-full rounded-full border border-black/40 bg-white">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />

        <main className="flex flex-1 flex-col">
          <section className="border-b border-primary/50 px-8 py-8">
            <div className="mx-auto flex max-w-7xl items-start justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-200 text-5xl">
                  👤
                </div>

                <div>
                  <h1 className="text-5xl font-medium tracking-tight text-black">
                    Welcome {user.firstName} {user.lastName}
                  </h1>
                  <button className="mt-2 text-xl text-black/70 underline underline-offset-4">
                    Add a bio
                  </button>
                </div>
              </div>

              <button className="rounded-xl border border-black/25 px-4 py-2 text-xl font-medium transition hover:bg-neutral-50">
                Edit Profile
              </button>
            </div>
          </section>

          <section className="mx-auto flex w-full max-w-7xl flex-1">
            <aside className="w-52 border-r border-primary/50 px-5 py-6">
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setActiveView("concepts")}
                  className={`rounded-xl px-4 py-2 text-left text-xl transition ${
                    activeView === "concepts"
                      ? "bg-primary/30 text-primary-dark"
                      : "text-black hover:bg-neutral-100"
                  }`}
                >
                  Concepts
                </button>

                <button
                  onClick={() => setActiveView("progress")}
                  className={`rounded-xl px-4 py-2 text-left text-xl transition ${
                    activeView === "progress"
                      ? "bg-primary/30 text-primary-dark"
                      : "text-black hover:bg-neutral-100"
                  }`}
                >
                  Progress
                </button>
              </div>
            </aside>

            <div className="flex-1 px-6 py-6">
              {activeView === "concepts" && (
                <section>
                  <h2 className="text-2xl font-medium text-black">Concepts</h2>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {concepts.map((concept) => (
                      <button
                        key={concept.name}
                        onClick={() => navigate("/quiz")}
                        className="rounded-2xl bg-primary/80 p-5 text-left transition hover:scale-[1.01] hover:bg-primary"
                      >
                        <div className="text-2xl font-medium text-black">
                          {concept.name}
                        </div>

                        {renderProgressBar(concept.progress)}

                        <div className="mt-2 text-sm text-black/70">
                          {concept.progress}%
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {activeView === "progress" && (
                <section>
                  <h2 className="text-2xl font-medium text-black">Progress</h2>

                  <div className="mt-4 rounded-2xl border border-black/10 bg-neutral-50 p-6">
                    <p className="text-lg text-black/75">
                      Your progress dashboard will appear here.
                    </p>

                    <div className="mt-6 space-y-5">
                      {concepts.map((concept) => (
                        <div key={concept.name}>
                          <div className="flex items-center justify-between text-lg">
                            <span>{concept.name}</span>
                            <span>{concept.progress}%</span>
                          </div>
                          {renderProgressBar(concept.progress)}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
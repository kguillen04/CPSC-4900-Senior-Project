import logo from "../assets/adaptly_logo.png";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { postJSON } from "../api.js";

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
          email: data.email ?? email,
        })
      );

      if (onAuth) onAuth(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-page">
      <div className="flex min-h-screen flex-col bg-white">
        <div className="flex justify-center pt-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-4xl text-primary">✦</span>
            <span className="text-3xl font-medium tracking-tight">
              Adaptly
            </span>
          </Link>
        </div>

        <main className="flex flex-1 items-center justify-center px-10 py-10">
          <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <section className="hidden justify-center lg:flex">
              <img
                src={logo}
                alt="Adaptly logo"
                className="w-[420px] object-contain opacity-90"
              />
            </section>

            <section className="mx-auto flex w-full max-w-md flex-col">
              <h1 className="mb-6 text-3xl font-medium tracking-tight">
                Sign up for Adaptly!
              </h1>

              <button
                type="button"
                className="flex h-14 w-full items-center justify-center gap-4 border border-black/25 bg-white text-xl transition hover:bg-neutral-50"
              >
                <span className="text-2xl text-[#4285F4]">G</span>
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-4 text-lg text-black/70">
                <div className="h-px flex-1 bg-black/30" />
                <span>Or sign up with email</span>
                <div className="h-px flex-1 bg-black/30" />
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-xl">Email</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    className="h-14 border border-black/25 px-4 text-lg outline-none focus:border-primary"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-xl">Password</span>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                    minLength={6}
                    className="h-14 border border-black/25 px-4 text-lg outline-none focus:border-primary"
                  />
                </label>

                {error && (
                  <div className="text-sm text-red-600">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 h-14 bg-primary text-xl font-medium transition hover:bg-primary-dark disabled:opacity-70"
                >
                  {loading ? "Creating account..." : "Sign up"}
                </button>
              </form>

              <p className="mt-5 text-lg">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary-dark underline underline-offset-4"
                >
                  Log in today
                </Link>
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
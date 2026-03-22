import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getJSON, postJSON } from "../api";

export default function EditProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
      setFirstName(parsedUser.firstName || "");
      setLastName(parsedUser.lastName || "");
      setBio(parsedUser.bio || "");
      setLoading(false);
    } catch {
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  async function handleSave(e) {
    e.preventDefault();
    if (!user?.userId) return;

    setSaving(true);
    setError("");

    try {
      const updatedUser = await postJSON(`/api/users/${user.userId}/profile`, {
        firstName,
        lastName,
        bio,
      });

      const mergedUser = {
        ...user,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        bio: updatedUser.bio,
      };

      localStorage.setItem("user", JSON.stringify(mergedUser));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div className="min-h-screen bg-page">
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />

        <main className="mx-auto w-full max-w-6xl flex-1 px-8 py-10">
          <h1 className="text-5xl font-semibold tracking-tight">Edit Profile</h1>

          <form
            onSubmit={handleSave}
            className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[120px_1fr]"
          >
            <div className="flex justify-center lg:justify-start">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-200 text-6xl">
                👤
              </div>
            </div>

            <div className="max-w-3xl space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-lg">First name</span>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    required
                    className="h-12 rounded-sm border border-black/20 px-4 text-lg outline-none focus:border-primary"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-lg">Last name</span>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    required
                    className="h-12 rounded-sm border border-black/20 px-4 text-lg outline-none focus:border-primary"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-lg">Bio</span>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="resize-none rounded-sm border border-black/20 px-4 py-3 text-lg outline-none focus:border-primary"
                  placeholder="Write a short bio..."
                />
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="rounded-xl bg-primary px-6 py-3 text-lg font-medium text-black transition hover:bg-primary-dark"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-primary px-6 py-3 text-lg font-medium text-black transition hover:bg-primary-dark disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
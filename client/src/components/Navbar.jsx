import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    }

  }, []);

  function handleLogout() {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  }

  return (
    <nav className="flex items-center justify-between border-b border-primary/60 px-8 py-5">
      
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex cursor-pointer items-center gap-3"
      >
        <div className="text-3xl leading-none text-primary">✦</div>
        <h1 className="text-2xl font-medium tracking-tight">Adaptly</h1>
      </div>

      {/* Right side */}
      {!user ? (
        <button
          onClick={() => navigate("/login")}
          className="rounded-2xl bg-primary px-5 py-2.5 text-lg font-medium transition hover:bg-primary-dark"
        >
          Log in
        </button>
      ) : (
        <div className="relative">
          
          {/* Profile button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-lg font-medium transition hover:bg-primary-dark"
          >
            {user.firstName || "Profile"}
            <span className="text-sm">▾</span>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-black/10 bg-white shadow-md">
              
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/dashboard");
                }}
                className="w-full px-4 py-3 text-left text-lg hover:bg-neutral-100"
              >
                View Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-lg text-red-600 hover:bg-neutral-100"
              >
                Log out
              </button>

            </div>
          )}
        </div>
      )}
    </nav>
  );
}
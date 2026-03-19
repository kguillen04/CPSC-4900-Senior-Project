import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between border-b border-primary/60 px-8 py-5">
      <div
        onClick={() => navigate("/")}
        className="flex cursor-pointer items-center gap-3"
      >
        <div className="text-4xl leading-none text-primary">✦</div>
        <h1 className="text-3xl font-medium tracking-tight text-black">
          Adaptly
        </h1>
      </div>

      <button
        onClick={() => navigate("/login")}
        className="rounded-2xl bg-primary px-5 py-2.5 text-lg font-medium text-black transition hover:scale-[1.02] hover:bg-primary-dark"
      >
        Log in
      </button>
    </nav>
  );
}
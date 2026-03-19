import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Landing() {
  return (
    <div className="min-h-screen bg-page">
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />

        <main className="flex flex-1 items-center justify-center px-6">
          <section className="flex max-w-3xl flex-col items-center text-center">
            <div className="mb-5 text-7xl leading-none text-primary">✦</div>

            <h1 className="text-6xl font-medium tracking-tight text-black sm:text-7xl">
              Adaptly
            </h1>

            <h2 className="mt-5 text-3xl font-medium text-primary-dark sm:text-4xl">
              Learn. Adapt. Master.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-500 sm:text-xl">
              Build your programming skills through personalized practice that
              adapts to your progress, targets weak areas, and helps you move
              toward mastery with confidence.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "./AuthContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const result = register(email, password);
    if (result.ok) navigate("/");
    else setError(result.message);
  };

  return (
    <div className="relative flex min-h-screen flex-col background-gradient-animate">
      <Navbar
        showTabs={false}
        activeTab="home"
        onNavigate={(id) => {
          if (id === "home") navigate("/");
        }}
      />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="fade-in w-full max-w-md rounded-2xl border border-white/[0.12] bg-white/[0.05] p-8 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400/85">
            New account
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Register
          </h1>
          <p className="mt-1 text-sm text-terminal-muted">
            Create an account to personalize your workspace.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
            {error ? (
              <p
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                role="alert"
              >
                {error}
              </p>
            ) : null}
            <div>
              <label
                htmlFor="register-email"
                className="block text-xs font-medium uppercase tracking-wider text-terminal-muted"
              >
                Email
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/[0.1] bg-black/30 px-4 py-2.5 text-sm text-white outline-none transition-[border,box-shadow] placeholder:text-slate-600 focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="register-password"
                className="block text-xs font-medium uppercase tracking-wider text-terminal-muted"
              >
                Password
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/[0.1] bg-black/30 px-4 py-2.5 text-sm text-white outline-none transition-[border,box-shadow] placeholder:text-slate-600 focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label
                htmlFor="register-confirm"
                className="block text-xs font-medium uppercase tracking-wider text-terminal-muted"
              >
                Confirm password
              </label>
              <input
                id="register-confirm"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/[0.1] bg-black/30 px-4 py-2.5 text-sm text-white outline-none transition-[border,box-shadow] placeholder:text-slate-600 focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-cyan-500/20 py-2.5 text-sm font-semibold text-cyan-100 ring-1 ring-cyan-500/40 transition-all duration-200 hover:bg-cyan-500/30"
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-terminal-muted">
            Already have an account?{" "}
            <Link
              className="font-medium text-cyan-400/90 underline-offset-4 transition-colors hover:text-cyan-300 hover:underline"
              to="/login"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

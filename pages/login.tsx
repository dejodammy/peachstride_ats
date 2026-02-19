// pages/login.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import "tailwindcss/tailwind.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const res = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });

  if (res?.error) {
    setError(res.error);
  } else {
    router.push("/candidateDashboard");
  }

  setLoading(false);
};

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)",
      }}
    >
      {/* Background blur shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          style={{ backgroundColor: "#ed3237" }}
        ></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          style={{ backgroundColor: "#848688" }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #ed3237 0%, #c5292e 100%)",
            }}
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              background: "linear-gradient(135deg, #ed3237 0%, #c5292e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome Back
          </h1>
          <p className="text-lg" style={{ color: "#848688" }}>
            Access your candidate dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/30">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold" style={{ color: "#373435" }}>
              Candidate Login
            </h2>
            <p className="text-sm mt-1" style={{ color: "#848688" }}>
              Enter your credentials to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-6 p-4 rounded-xl border"
              style={{
                backgroundColor: "#fef2f2",
                borderColor: "#ed3237",
                color: "#ed3237",
              }}
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01M6.938 19h10.124a2 2 0 001.732-2.5L13.732 4a2 2 0 00-3.464 0L5.206 16.5A2 2 0 006.938 19z"
                  />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#373435" }}>
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border-2 px-4 py-3 pl-12 outline-none transition-all"
                  style={{
                    borderColor: "#e5e7eb",
                    backgroundColor: "#ffffff",
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "#ed3237")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  required
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: "#848688" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#373435" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border-2 px-4 py-3 pl-12 pr-12 outline-none transition-all"
                  style={{
                    borderColor: "#e5e7eb",
                    backgroundColor: "#ffffff",
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "#ed3237")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  required
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: "#848688" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                {/* Eye Icon Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#ed3237]"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.964 9.964 0 012.124-6.124m3.084-2.085A9.969 9.969 0 0112 3c5.523 0 10 4.477 10 10 0 1.065-.165 2.09-.47 3.048M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="hidden" />
                <div
                  className="w-4 h-4 border-2 rounded mr-2 flex items-center justify-center"
                  style={{ borderColor: "#ed3237" }}
                ></div>
                <span style={{ color: "#848688" }}>Remember me</span>
              </label>
              <button
                type="button"
                className="hover:underline transition-colors"
                style={{ color: "#ed3237" }}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl px-6 py-4 font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{
                background: loading
                  ? "#848688"
                  : "linear-gradient(135deg, #ed3237 0%, #c5292e 100%)",
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {/* Register */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                New to our platform?{" "}
                <button
                  type="button"
                  className="hover:underline text-[#ed3237]"
                  onClick={() => router.push("/apply")}
                >
                  Create New Application
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

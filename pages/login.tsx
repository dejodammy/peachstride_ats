//pages/login.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import "tailwindcss/tailwind.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    console.log('Attempting login with:', { email, phone });
    
    const res = await fetch("/api/candidates/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone }),
    });

    console.log('Response status:', res.status);
    console.log('Response headers:', Object.fromEntries(res.headers.entries()));

    // Check if the response is actually JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error('Non-JSON response received:', text.substring(0, 200));
      throw new Error("Server returned an invalid response. Please try again later.");
    }

    const data = await res.json();
    console.log('Response data:', data);

    if (res.ok) {
      // Save candidate ID in localStorage (optional)
      localStorage.setItem("candidateId", data.id.toString());
      router.push("/candidateDashboard");
    } else {
      setError(data.message || "Login failed. Please try again.");
    }
  } catch (err) {
    console.error("Login error:", err);
    
    if (err instanceof TypeError && err.message.includes('JSON')) {
      setError("Server configuration error. Please contact support.");
    } else {
      setError(err.message || "Network error. Please check your connection and try again.");
    }
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)' 
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10" 
             style={{ backgroundColor: '#ed3237' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10" 
             style={{ backgroundColor: '#848688' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10" 
             style={{ backgroundColor: '#ed3237' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg"
               style={{ background: 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{
            background: 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Welcome Back
          </h1>
          <p className="text-lg" style={{ color: '#848688' }}>
            Access your candidate dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/30">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold" style={{ color: '#373435' }}>
              Candidate Login
            </h2>
            <p className="text-sm mt-1" style={{ color: '#848688' }}>
              Enter your credentials to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl border" style={{ 
              backgroundColor: '#fef2f2', 
              borderColor: '#ed3237',
              color: '#ed3237'
            }}>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#373435' }}>
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full rounded-xl border-2 px-4 py-3 pl-12 transition-all duration-200 outline-none"
                  style={{ 
                    borderColor: '#e5e7eb', 
                    backgroundColor: '#ffffff' 
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#ed3237'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  required
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                     style={{ color: '#848688' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#373435' }}>
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border-2 px-4 py-3 pl-12 transition-all duration-200 outline-none"
                  style={{ 
                    borderColor: '#e5e7eb', 
                    backgroundColor: '#ffffff' 
                  }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#ed3237'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  required
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                     style={{ color: '#848688' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="hidden" />
                <div className="w-4 h-4 border-2 rounded mr-2 flex items-center justify-center"
                     style={{ borderColor: '#ed3237' }}>
                  <svg className="w-3 h-3 text-white hidden" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span style={{ color: '#848688' }}>Remember me</span>
              </label>
              <button type="button" className="hover:underline transition-colors"
                      style={{ color: '#ed3237' }}>
                Forgot details?
              </button>
            </div>

            {/* Login Button */}
            <button
              type = "submit"
              disabled={loading}
              className="w-full rounded-xl px-6 py-4 font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{ 
                background: loading ? '#848688' : 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.background = 'linear-gradient(135deg, #c5292e 0%, #b02429 100%)';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)';
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Sign In
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#e5e7eb' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white" style={{ color: '#848688' }}>
                  New to our platform?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <button 
                type="button"
                className="w-full rounded-xl px-6 py-3 font-medium border-2 transition-all duration-200 hover:bg-gray-50"
                style={{ 
                  borderColor: '#ed3237',
                  color: '#ed3237',
                  backgroundColor: 'transparent'
                }}
                onClick={() => router.push('/apply')}
              >
                Create New Application
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm" style={{ color: '#848688' }}>
          <p>
            Having trouble accessing your account?{' '}
            <button className="hover:underline transition-colors" style={{ color: '#ed3237' }}>
              Contact Support
            </button>
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="flex items-center text-sm" style={{ color: '#848688' }}>
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Your information is protected with enterprise-grade security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
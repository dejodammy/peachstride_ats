import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import questions from "../data/questions";
import "tailwindcss/tailwind.css";

export default function TestPage() {
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasTakenTest, setHasTakenTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [existingScore, setExistingScore] = useState<number | null>(null);

  const [applicantId, setApplicantId] = useState<string | null>(null);
  const router = useRouter();

  const nextPage = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };
  
  const getProgress = () => {
    if (!questions.length) return 0;
    return (currentQuestion / questions.length) * 100;
  };

  // ✅ Get applicant ID
  useEffect(() => {
    if (router.query.applicantId) {
      setApplicantId(String(router.query.applicantId));
    }
  }, [router.query.applicantId]);

  // ✅ FIXED: Enhanced test status checking
  useEffect(() => {
    const checkIfTaken = async () => {
      if (!router.query.applicantId) {
        setLoading(false);
        return;
      }

      const appId = String(router.query.applicantId);
      
      // Check multiple localStorage keys for backwards compatibility
      const testTakenKey = `test_taken_${appId}`;
      const testSubmittedKey = `test_submitted_${appId}`;
      const testScoreKey = `test_score_${appId}`;
      
      const isMarkedTaken = localStorage.getItem(testTakenKey) === "true";
      const isMarkedSubmitted = localStorage.getItem(testSubmittedKey) === "true";
      const storedScore = localStorage.getItem(testScoreKey);
      
      // If ANY indicator shows test was taken, block access
      if (isMarkedTaken || isMarkedSubmitted || storedScore) {
        setHasTakenTest(true);
        if (storedScore) {
          setExistingScore(parseFloat(storedScore));
        }
        setLoading(false);
        return;
      }

      // Also check database
      try {
        const res = await fetch(`/api/${appId}/score`);
        if (res.ok) {
          const data = await res.json();
          if (data.score !== null && data.score !== undefined) {
            setHasTakenTest(true);
            setExistingScore(data.score);
            // Store in ALL localStorage keys for redundancy
            localStorage.setItem(testTakenKey, "true");
            localStorage.setItem(testSubmittedKey, "true");
            localStorage.setItem(testScoreKey, data.score.toString());
          }
        }
      } catch (err) {
        console.error("Error checking test:", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkIfTaken();
  }, [router.query.applicantId]);

  // ✅ FIXED: Prevent navigation manipulation
  useEffect(() => {
    if (!hasTakenTest || !router.query.applicantId) return;
    
    const preventAccess = () => {
      router.replace("/login");
    };

    // Block back button
    const handlePopState = (e) => {
      e.preventDefault();
      preventAccess();
    };

    // Block page unload if test already taken
    const handleBeforeUnload = (e) => {
      if (hasTakenTest) {
        preventAccess();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    
    // Push a dummy state to prevent back navigation
    if (hasTakenTest) {
      window.history.pushState(null, "", window.location.href);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasTakenTest, router]);

  // ✅ FIXED: Prevent test start if already taken
  useEffect(() => {
    if (!loading && hasTakenTest && !submitted) {
      router.replace("/login");
    }
  }, [loading, hasTakenTest, submitted, router]);

  const questionsPerPage = 2;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  // ✅ Countdown Timer - only run if test not taken
  useEffect(() => {
    if (hasTakenTest) return;
    
    if (timeLeft > 0 && !submitted) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted, hasTakenTest]);

  const handleChange = (qId, option) => {
    // Prevent answering if test already taken
    if (hasTakenTest) return;
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  // ✅ FIXED: Enhanced submit with multiple safeguards
  const handleSubmit = async () => {
    // Prevent double submission
    if (submitted || hasTakenTest) return;
    
    setSubmitted(true);

    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) correct++;
    });

    const result = (correct / questions.length) * 100;
    setScore(result);

    if (!applicantId) {
      console.error("Missing applicant ID");
      return;
    }

    // Immediately mark as taken in localStorage (before API call)
    localStorage.setItem(`test_taken_${applicantId}`, "true");
    localStorage.setItem(`test_submitted_${applicantId}`, "true");
    localStorage.setItem(`test_score_${applicantId}`, result.toString());
    localStorage.setItem(`test_timestamp_${applicantId}`, new Date().toISOString());

    try {
      const res = await fetch(`/api/${applicantId}/score`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          score: result, 
          passed: result >= 70,
          submittedAt: new Date().toISOString()
        }),
      });

      if (res.ok) {
        setHasTakenTest(true);
      } else {
        console.error("Failed to save score to database");
      }
    } catch (err) {
      console.error("Error saving score:", err);
      // Even if API fails, keep the test marked as taken locally
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)' }}>
            <svg className="animate-spin w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-lg font-medium">Checking test status...</p>
        </div>
      </div>
    );
  }

  if (hasTakenTest && !submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-gray-50">
        <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 bg-red-600 text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01M6.938 19h10.124c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.206 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Test Already Completed</h2>
          <p className="text-gray-600 mb-4">
            You have already completed this assessment and cannot retake it.
          </p>
          {existingScore !== null && (
            <div className="p-3 bg-gray-100 rounded-xl mb-4">
              <p className="text-sm text-gray-600">Your Score</p>
              <p className="text-2xl font-bold" style={{ 
                color: existingScore >= 70 ? '#10b981' : '#ed3237' 
              }}>
                {Math.round(existingScore)}%
              </p>
            </div>
          )}
          <p className="text-sm text-gray-500 mb-6">
            If you believe this is an error, please contact the HR department.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:opacity-90 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ 
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

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg"
               style={{ background: 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{
            background: 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Applicant Assessment
          </h1>
          <p className="text-lg" style={{ color: '#848688' }}>
            Complete the assessment to proceed with your application
          </p>
        </div>

        {/* Timer and Progress */}
        {!submitted && (
          <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-6 mb-8 border border-white/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" style={{ color: timeLeft <= 300 ? '#ed3237' : '#848688' }} 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold" style={{ color: timeLeft <= 300 ? '#ed3237' : '#373435' }}>
                  Time Remaining: {formatTime(timeLeft)}
                </span>
                {timeLeft <= 300 && (
                  <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium text-white animate-pulse"
                        style={{ backgroundColor: '#ed3237' }}>
                    Hurry!
                  </span>
                )}
              </div>
              <div className="text-sm" style={{ color: '#848688' }}>
                Question {((currentPage - 1) * questionsPerPage) + 1}-{Math.min(currentPage * questionsPerPage, questions.length)} of {questions.length}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2" style={{ color: '#848688' }}>
                <span>Progress</span>
                <span>{Math.round(getProgress())}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${getProgress()}%`,
                    background: 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)'
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {!submitted ? (
          <div className="space-y-6">
            {/* Questions */}
            {currentQuestions.map((q) => (
              <div key={q.id} className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/30">
                <div className="flex items-start mb-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4"
                        style={{ backgroundColor: '#ed3237', color: 'white' }}>
                    {q.id}
                  </span>
                  <h3 className="text-lg font-semibold" style={{ color: '#373435' }}>
                    {q.question}
                  </h3>
                </div>

                <div className="ml-12 space-y-3">
                  {q.options.map((opt, index) => (
                    <label 
                      key={opt} 
                      className="flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50"
                      style={{
                        backgroundColor: answers[q.id] === opt ? '#f8f9fa' : 'transparent',
                        border: `2px solid ${answers[q.id] === opt ? '#ed3237' : '#e5e7eb'}`
                      }}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleChange(q.id, opt)}
                        className="hidden"
                      />
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3"
                             style={{ 
                               borderColor: answers[q.id] === opt ? '#ed3237' : '#d1d5db',
                               backgroundColor: answers[q.id] === opt ? '#ed3237' : 'transparent'
                             }}>
                          {answers[q.id] === opt && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="font-medium" style={{ 
                          color: answers[q.id] === opt ? '#ed3237' : '#373435' 
                        }}>
                          {String.fromCharCode(65 + index)}. {opt}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: currentPage === 1 ? '#f3f4f6' : '#848688',
                  color: currentPage === 1 ? '#9ca3af' : 'white'
                }}
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className="w-10 h-10 rounded-full font-medium transition-all duration-200"
                    style={{
                      backgroundColor: page === currentPage ? '#ed3237' : '#f3f4f6',
                      color: page === currentPage ? 'white' : '#6b7280'
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {currentPage === totalPages ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitted}
                  className="px-6 py-3 rounded-xl font-medium text-white transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50"
                  style={{ 
                    background: 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)'
                  }}
                >
                  Submit Test
                  <svg className="w-4 h-4 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={nextPage}
                  className="px-6 py-3 rounded-xl font-medium text-white transform hover:scale-105 transition-all duration-200"
                  style={{ backgroundColor: '#ed3237' }}
                >
                  Next
                  <svg className="w-4 h-4 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results */
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/30 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
                   style={{ 
                     backgroundColor: score >= 70 ? '#10b981' : '#ed3237',
                     color: 'white'
                   }}>
                {score >= 70 ? (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#373435' }}>
                Assessment Complete!
              </h2>
              
              <div className="text-6xl font-bold mb-4" style={{ color: score >= 70 ? '#10b981' : '#ed3237' }}>
                {Math.round(score)}%
              </div>
              
              <p className="text-xl mb-6" style={{ color: '#848688' }}>
                You answered {Object.keys(answers).filter(key => 
                  answers[key] === questions.find(q => q.id == key)?.answer
                ).length} out of {questions.length} questions correctly
              </p>

              {score >= 70 ? (
                <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: '#f0fdf4', border: '1px solid #10b981' }}>
                  <p className="font-semibold text-green-800 flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Congratulations! You passed the assessment
                  </p>
                  <p className="text-green-700 text-sm mb-6">
                    You can now create a password to complete your application profile.
                  </p>

                  {/* 🔐 Create Password Form Section */}
                  <div className="mt-4 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">
                      Create Your Account Password
                    </h3>
                    <CreatePasswordForm applicantId={applicantId} />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: '#fef2f2', border: '1px solid #ed3237' }}>
                  <p className="font-semibold flex items-center justify-center" style={{ color: '#ed3237' }}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Assessment not passed
                  </p>
                  <p className="text-sm mt-2" style={{ color: '#dc2626' }}>
                    You need at least 70% to pass. Unfortunately, you will not be proceeding to the next stage.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t pt-6" style={{ borderColor: '#e5e7eb' }}>
              <p className="text-sm" style={{ color: '#848688' }}>
                Thank you for completing the assessment. Our HR team will be in touch soon.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CreatePasswordForm({ applicantId }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/${applicantId}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError("Failed to save password. Try again.");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Create Password
        </label>
        <input
          type="password"
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading || success}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          disabled={loading || success}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">Password set successfully! Redirecting...</p>}

      <button
        type="submit"
        disabled={loading || success}
        className="w-full py-3 rounded-xl font-medium text-white transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)' }}
      >
        {loading ? "Saving..." : success ? "Saved!" : "Save Password"}
      </button>
    </form>
  );
}
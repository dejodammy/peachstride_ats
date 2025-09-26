import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import questions from "../data/questions";
import "tailwindcss/tailwind.css";

export default function TestPage() {
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 mins in seconds
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showWarning, setShowWarning] = useState(false);

  const [applicantId, setApplicantId] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Grab applicantId from query string reliably
  useEffect(() => {
    if (router.query.applicantId) {
      setApplicantId(String(router.query.applicantId));
    }
  }, [router.query.applicantId]);

  const questionsPerPage = 2;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 300 && t > 240) {
            setShowWarning(true); // 5 min warning
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit(); // auto-submit when time runs out
    }
  }, [timeLeft, submitted]);

  const handleChange = (qId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: option,
    }));
  };

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) {
        correct++;
      }
    });

    const result = (correct / questions.length) * 100;
    setScore(result);
    setSubmitted(true);

    if (!applicantId) {
      console.error("Applicant ID is missing");
      return;
    }

    try {
      const res = await fetch(`/api/applicants/${applicantId}/score`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: result,
          passed: result >= 70,
        }),
      });
      if (!res.ok) {
        console.error("Failed to update score on server");
      }
    } catch (err) {
      console.error("Failed to save score", err);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const getProgress = () => {
    const answeredQuestions = Object.keys(answers).length;
    return (answeredQuestions / questions.length) * 100;
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
                  className="px-6 py-3 rounded-xl font-medium text-white transform hover:scale-105 transition-all duration-200 shadow-lg"
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
                  <p className="font-semibold text-green-800 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Congratulations! You passed the assessment
                  </p>
                  <p className="text-green-700 text-sm mt-2">
                    Your application will proceed to the next stage of review.
                  </p>
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
                    You need at least 70% to pass. You sadly would not be making it to the next stage.
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
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession, signOut } from "next-auth/react"; // ✅ added signOut
import "tailwindcss/tailwind.css";


export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
}
export default function CandidateDashboard() {
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem("candidateId");
    if (!id) {
      setError("No candidate ID found. Please login again.");
      setLoading(false);
      router.push("/login");
      return;
    }

    async function fetchCandidate() {
      try {
        const res = await fetch(`/api/candidates/${id}`);
        if (!res.ok) throw new Error("Failed to fetch candidate data");
        const data = await res.json();
        setCandidate(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load candidate information.");
      } finally {
        setLoading(false);
      }
    }

    fetchCandidate();
  }, [router]);

  // Dynamic stage determination based on database fields
const getCurrentStage = (candidate: any) => {
  if (!candidate) return "Applied";

  // 1. In-house test
  if (candidate.score === null) {
    return "Applied - Awaiting In-house Test";
  }
  if (candidate.score < 70 || candidate.passed === false) {
    return "In-house Test Failed";
  }

  // 2. NBC Assessment
  if (candidate.nbcAssessmentDate === null) {
    return "NBC Assessment Pending";
  }
  if (candidate.nbcPassed === false) {
    return "NBC Assessment Failed";
  }

  // 3. Interview
  if (candidate.interviewDate === null) {
    return "Interview Scheduling";
  }

  // 4. Training
  if (candidate.trainingDate === null) {
    return "Training Scheduling";
  }

  // ✅ New conditions for training results
  if (candidate.trainingPassed === false) {
    return "Training Failed";
  }
  if (candidate.trainingPassed === true) {
    return "Completed";
  }

  // Default
  return "Training Scheduled";
};

const getStageInfo = (stage: string) => {
  const stages = {
    "Applied": { color: "#848688", icon: "document", progress: 10 },
    "Applied - Awaiting In-house Test": { color: "#848688", icon: "clock", progress: 15 },
    "In-house Test Failed": { color: "#dc2626", icon: "x", progress: 25 },
    "NBC Assessment Pending": { color: "#f59e0b", icon: "academic-cap", progress: 35 },
    "NBC Assessment Failed": { color: "#dc2626", icon: "x", progress: 45 },
    "Interview Scheduling": { color: "#f59e0b", icon: "video-camera", progress: 60 },
    "Training Scheduling": { color: "#10b981", icon: "users", progress: 80 },
    "Training Scheduled": { color: "#10b981", icon: "users", progress: 85 },
    "Training Failed": { color: "#dc2626", icon: "x", progress: 90 },
    "Completed": { color: "#10b981", icon: "badge-check", progress: 100 }
  };
  return stages[stage] || { color: "#848688", icon: "document", progress: 0 };
};


  const getIconSvg = (iconName: string) => {
    const icons = {
      document: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      ),
      clock: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />,
      x: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />,
      "academic-cap": (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
      ),
      "video-camera": (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      ),
      users: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      ),
      "badge-check": (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      )
    };
    return icons[iconName] || icons.document;
  };

const getStageMessage = (stage: string) => {
  const messages = {
    "Applied": "Your application has been received and is under review.",
    "Applied - Awaiting In-house Test": "Your in-house test will be scheduled soon.",
    "In-house Test Failed": "Unfortunately, you did not pass the in-house test.",
    "NBC Assessment Pending": "Your NBC assessment date will be updated soon.",
    "NBC Assessment Failed": "You did not pass the NBC assessment.",
    "Interview Scheduling": "Your interview will be scheduled soon.",
    "Training Scheduling": "Your training date and location will be updated soon.",
    "Training Scheduled": "You're almost there! Please attend your scheduled training.",
    "Training Failed": "Unfortunately, you did not pass training. Please contact HR.",
    "Completed": "🎉 Congratulations! You successfully completed all stages."
  };
  return messages[stage] || "Your application is being processed.";
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!candidate) return null;

  const currentStage = getCurrentStage(candidate);
  const stageInfo = getStageInfo(currentStage);

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
      </div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg"
               style={{ background: 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{
            background: 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Welcome back, {candidate.firstName}
          </h1>

          <div className="text-center mb-6">
  <button
    onClick={() => signOut({ callbackUrl: "/login" })}
    className="px-6 py-2 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
    style={{ background: 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)' }}
  >
    Logout
  </button>
</div>
          <p className="text-lg" style={{ color: '#848688' }}>
            Track your application progress and upcoming activities
          </p>
        </div>

        {/* Current Stage Card */}
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-8 mb-8 border border-white/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#373435' }}>
              Current Status
            </h2>
            <div className="flex items-center px-4 py-2 rounded-full" 
                 style={{ backgroundColor: stageInfo.color, color: 'white' }}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {getIconSvg(stageInfo.icon)}
              </svg>
              <span className="font-medium">{currentStage}</span>
            </div>
          </div>

          {/* Stage Message */}
          <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#f8f9fa' }}>
            <p style={{ color: '#373435' }}>{getStageMessage(currentStage)}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2" style={{ color: '#848688' }}>
              <span>Application Progress</span>
              <span>{stageInfo.progress}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${stageInfo.progress}%`,
                  background: 'linear-gradient(135deg, #ed3237 0%, #c5292e 100%)'
                }}
              ></div>
            </div>
          </div>

          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-4 rounded-xl" style={{ backgroundColor: '#f8f9fa' }}>
              <svg className="w-6 h-6 mr-3" style={{ color: '#ed3237' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <div>
                <p className="text-sm" style={{ color: '#848688' }}>Email</p>
                <p className="font-medium" style={{ color: '#373435' }}>{candidate.email}</p>
              </div>
            </div>
            <div className="flex items-center p-4 rounded-xl" style={{ backgroundColor: '#f8f9fa' }}>
              <svg className="w-6 h-6 mr-3" style={{ color: '#ed3237' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="text-sm" style={{ color: '#848688' }}>Phone</p>
                <p className="font-medium" style={{ color: '#373435' }}>{candidate.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* In-house Test */}
          {candidate.score !== null && (
            <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold" style={{ color: '#373435' }}>In-house Assessment</h3>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${(candidate.score >= 70 && candidate.passed !== false) ? 'bg-green-100' : 'bg-red-100'}`}>
                  <svg className={`w-6 h-6 ${(candidate.score >= 70 && candidate.passed !== false) ? 'text-green-600' : 'text-red-600'}`} 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {(candidate.score >= 70 && candidate.passed !== false)
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /> 
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    }
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${(candidate.score >= 70 && candidate.passed !== false) ? 'text-green-600' : 'text-red-600'}`}>
                  {candidate.score}%
                </div>
                <p className={`font-medium ${(candidate.score >= 70 && candidate.passed !== false) ? 'text-green-800' : 'text-red-800'}`}>
                  {(candidate.score >= 70 && candidate.passed !== false) ? 'Passed' : 'Failed'}
                </p>
              </div>
            </div>
          )}

          {/* NBC Assessment */}
{/* NBC Assessment */}
{candidate.nbcAssessmentDate !== null && (
  <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/30">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold" style={{ color: '#373435' }}>NBC Assessment</h3>
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          candidate.nbcPassed === null
            ? "bg-yellow-100"
            : candidate.nbcPassed
            ? "bg-green-100"
            : "bg-red-100"
        }`}
      >
        <svg
          className={`w-6 h-6 ${
            candidate.nbcPassed === null
              ? "text-yellow-600"
              : candidate.nbcPassed
              ? "text-green-600"
              : "text-red-600"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {candidate.nbcPassed === null ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" // clock icon
            />
          ) : candidate.nbcPassed ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7" // check icon
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12" // x icon
            />
          )}
        </svg>
      </div>
    </div>

    <div className="mb-4">
      <p className="text-sm mb-1" style={{ color: '#848688' }}>Assessment Date</p>
      <p className="font-medium" style={{ color: '#373435' }}>
        {new Date(candidate.nbcAssessmentDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>

    <p
      className={`font-medium text-center ${
        candidate.nbcPassed === null
          ? "text-yellow-800"
          : candidate.nbcPassed
          ? "text-green-800"
          : "text-red-800"
      }`}
    >
      {candidate.nbcPassed === null
        ? "Pending"
        : candidate.nbcPassed
        ? "Passed"
        : "Failed"}
    </p>
  </div>
)}

        </div>

        {/* Upcoming Activities */}
        <div className="space-y-6">
{/* Interview */}
{candidate.nbcPassed && (
  <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/30">
    <div className="flex items-center mb-4">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
        style={{
          backgroundColor:
            candidate.interviewPassed === null
              ? "#f59e0b" // yellow for pending
              : candidate.interviewPassed
              ? "#10b981" // green for pass
              : "#dc2626", // red for fail
        }}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {candidate.interviewPassed === null ? (
            // clock
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          ) : candidate.interviewPassed ? (
            // check
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          ) : (
            // X
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          )}
        </svg>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold" style={{ color: "#373435" }}>
          {candidate.interviewPassed === null
            ? candidate.interviewDate
              ? "Interview Scheduled"
              : "Interview Pending"
            : candidate.interviewPassed
            ? "Interview Passed"
            : "Interview Failed"}
        </h3>

        {/* Show interview date if scheduled */}
        {candidate.interviewDate && (
          <p style={{ color: "#848688" }}>
            {new Date(candidate.interviewDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}

        {/* Show interview comment if available */}
        {candidate.interviewComment && (
          <p
            className="mt-2 text-sm italic"
            style={{ color: "#848688" }}
          >
            Feedback: "{candidate.interviewComment}"
          </p>
        )}
      </div>

      {/* Join button if link exists */}
      {candidate.interviewLink && candidate.interviewPassed === null && (
        <a
          href={candidate.interviewLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl font-medium text-white transform hover:scale-105 transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #ed3237 0%, #c5292e 100%)",
          }}
        >
          Join Interview
        </a>
      )}
    </div>
  </div>
)}



          {/* Training */}
          {candidate.trainingDate && (
            <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/30">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                     style={{ backgroundColor: '#10b981' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold" style={{ color: '#373435' }}>Training Program</h3>
                  <p style={{ color: '#848688' }}>
                    {new Date(candidate.trainingDate).toLocaleDateString('en-US', { 
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  {candidate.trainingLocation && (
                    <p className="text-sm mt-1" style={{ color: '#848688' }}>
                      Location: {candidate.trainingLocation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center">
          <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/30">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#373435' }}>
              Need assistance?
            </h3>
            <p className="mb-4" style={{ color: '#848688' }}>
              Our HR team is here to help with any questions about your application process.
            </p>
            <button 
              className="px-6 py-3 rounded-xl font-medium border-2 transition-all duration-200 hover:bg-gray-50"
              style={{ 
                borderColor: '#ed3237',
                color: '#ed3237'
              }}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
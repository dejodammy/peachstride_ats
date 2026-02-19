import React, { useState } from "react";
import { useRouter } from "next/router";
import "tailwindcss/tailwind.css";

export default function ApplyPage() {
  const router = useRouter();
  const { jobId } = router.query;
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
    address: "",
    state: "",
    age: "",
  });
  const [cv, setCv] = useState<File | null>(null);
  const [nysc, setNysc] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};
    if (step === 1) {
      if (!form.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!form.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email))
        newErrors.email = "Invalid email format";
      if (!form.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!/^\+?[\d\s-()]{10,}$/.test(form.phone))
        newErrors.phone = "Invalid phone format";
    } else if (step === 2) {
      if (!form.gender) newErrors.gender = "Please select a gender";
      if (!form.age.trim()) newErrors.age = "Age is required";
      else if (parseInt(form.age) < 18 || parseInt(form.age) > 65)
        newErrors.age = "Age must be between 18-65";
      if (!form.state.trim()) newErrors.state = "State is required";
      if (!form.address.trim()) newErrors.address = "Address is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(2);
  };
  const prevStep = () => {
    setStep(1);
    setErrors({});
  };

  const onSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cv: cv?.name || "",
          nysc: nysc?.name || "",
          jobId: jobId ? parseInt(jobId as string) : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit application");

      const data = await res.json();
      router.push(`/test?applicantId=${data.id}`); // use the Prisma ID
    } catch (err: any) {
      setMsg("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const progressWidth = step === 1 ? "50%" : "100%";

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)",
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          style={{ backgroundColor: "#ed3237" }}
        ></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          style={{ backgroundColor: "#848688" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          style={{ backgroundColor: "#ed3237" }}
        ></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="w-full max-w-4xl">
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
              className="text-4xl font-bold mb-2"
              style={{
                background: "linear-gradient(135deg, #ed3237 0%, #c5292e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Join Our Team
            </h1>
            <p className="text-lg" style={{ color: "#848688" }}>
              Take the first step towards an exciting career opportunity
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div
              className="flex items-center justify-between text-sm mb-2"
              style={{ color: "#848688" }}
            >
              <span
                className={step >= 1 ? "font-medium" : ""}
                style={{ color: step >= 1 ? "#ed3237" : "#848688" }}
              >
                Personal Info
              </span>
              <span
                className={step >= 2 ? "font-medium" : ""}
                style={{ color: step >= 2 ? "#ed3237" : "#848688" }}
              >
                Details & Documents
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: progressWidth,
                  background:
                    "linear-gradient(135deg, #ed3237 0%, #c5292e 100%)",
                }}
              ></div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/30">
            <div className="space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <h2
                    className="text-2xl font-semibold mb-6 flex items-center"
                    style={{ color: "#373435" }}
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3"
                      style={{ backgroundColor: "#ed3237", color: "white" }}
                    >
                      1
                    </span>
                    Personal Information
                  </h2>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#373435" }}
                      >
                        First Name *
                      </label>
                      <input
                        name="firstName"
                        value={form.firstName}
                        onChange={onChange}
                        placeholder="Enter your first name"
                        className="w-full rounded-xl border-2 px-4 py-3 transition-all duration-200 outline-none"
                        style={{
                          borderColor: errors.firstName ? "#ed3237" : "#e5e7eb",
                          backgroundColor: "#ffffff",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#ed3237")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = errors.firstName
                            ? "#ed3237"
                            : "#e5e7eb")
                        }
                      />
                      {errors.firstName && (
                        <p
                          className="text-sm mt-1"
                          style={{ color: "#ed3237" }}
                        >
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="group">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#373435" }}
                      >
                        Last Name *
                      </label>
                      <input
                        name="lastName"
                        value={form.lastName}
                        onChange={onChange}
                        placeholder="Enter your last name"
                        className="w-full rounded-xl border-2 px-4 py-3 transition-all duration-200 outline-none"
                        style={{
                          borderColor: errors.lastName ? "#ed3237" : "#e5e7eb",
                          backgroundColor: "#ffffff",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#ed3237")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = errors.lastName
                            ? "#ed3237"
                            : "#e5e7eb")
                        }
                      />
                      {errors.lastName && (
                        <p
                          className="text-sm mt-1"
                          style={{ color: "#ed3237" }}
                        >
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="space-y-6">
                    <div className="group">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#373435" }}
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="your.email@example.com"
                        className="w-full rounded-xl border-2 px-4 py-3 transition-all duration-200 outline-none"
                        style={{
                          borderColor: errors.email ? "#ed3237" : "#e5e7eb",
                          backgroundColor: "#ffffff",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#ed3237")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = errors.email
                            ? "#ed3237"
                            : "#e5e7eb")
                        }
                      />
                      {errors.email && (
                        <p
                          className="text-sm mt-1"
                          style={{ color: "#ed3237" }}
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="group">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#373435" }}
                      >
                        Phone Number *
                      </label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        placeholder="+234 xxx xxx xxxx"
                        className="w-full rounded-xl border-2 px-4 py-3 transition-all duration-200 outline-none"
                        style={{
                          borderColor: errors.phone ? "#ed3237" : "#e5e7eb",
                          backgroundColor: "#ffffff",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#ed3237")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = errors.phone
                            ? "#ed3237"
                            : "#e5e7eb")
                        }
                      />
                      {errors.phone && (
                        <p
                          className="text-sm mt-1"
                          style={{ color: "#ed3237" }}
                        >
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Next Button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full rounded-xl px-6 py-4 font-medium text-white transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, #ed3237 0%, #c5292e 100%)",
                        border: "none",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.background =
                          "linear-gradient(135deg, #c5292e 0%, #b02429 100%)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background =
                          "linear-gradient(135deg, #ed3237 0%, #c5292e 100%)")
                      }
                    >
                      Continue to Next Step
                      <svg
                        className="inline w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2
                      className="text-2xl font-semibold flex items-center"
                      style={{ color: "#373435" }}
                    >
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3"
                        style={{ backgroundColor: "#ed3237", color: "white" }}
                      >
                        2
                      </span>
                      Additional Details
                    </h2>
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center font-medium text-sm transition-colors hover:opacity-80"
                      style={{ color: "#ed3237" }}
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back
                    </button>
                  </div>

                  {/* Demographics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#373435" }}
                      >
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={onChange}
                        className="w-full rounded-xl border-2 px-4 py-3 transition-all duration-200 outline-none"
                        style={{
                          borderColor: errors.gender ? "#ed3237" : "#e5e7eb",
                          backgroundColor: "#ffffff",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#ed3237")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = errors.gender
                            ? "#ed3237"
                            : "#e5e7eb")
                        }
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {errors.gender && (
                        <p
                          className="text-sm mt-1"
                          style={{ color: "#ed3237" }}
                        >
                          {errors.gender}
                        </p>
                      )}
                    </div>

                    <div className="group">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#373435" }}
                      >
                        Age *
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={form.age}
                        onChange={onChange}
                        placeholder="25"
                        min="18"
                        max="65"
                        className="w-full rounded-xl border-2 px-4 py-3 transition-all duration-200 outline-none"
                        style={{
                          borderColor: errors.age ? "#ed3237" : "#e5e7eb",
                          backgroundColor: "#ffffff",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#ed3237")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = errors.age
                            ? "#ed3237"
                            : "#e5e7eb")
                        }
                      />
                      {errors.age && (
                        <p
                          className="text-sm mt-1"
                          style={{ color: "#ed3237" }}
                        >
                          {errors.age}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-6">
                    <div className="group">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#373435" }}
                      >
                        State *
                      </label>
                      <select
                        name="state"
                        value={form.state}
                        onChange={onChange}
                        className="w-full rounded-xl border-2 px-4 py-3 transition-all duration-200 outline-none"
                        style={{
                          borderColor: errors.state ? "#ed3237" : "#e5e7eb",
                          backgroundColor: "#ffffff",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#ed3237")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = errors.state
                            ? "#ed3237"
                            : "#e5e7eb")
                        }
                      >
                        <option value="">Select your state</option>
                        {nigerianStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p
                          className="text-sm mt-1"
                          style={{ color: "#ed3237" }}
                        >
                          {errors.state}
                        </p>
                      )}
                    </div>

                    <div className="group">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#373435" }}
                      >
                        Full Address *
                      </label>
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={onChange}
                        placeholder="Enter your complete address"
                        rows={3}
                        className="w-full rounded-xl border-2 px-4 py-3 transition-all duration-200 outline-none resize-none"
                        style={{
                          borderColor: errors.address ? "#ed3237" : "#e5e7eb",
                          backgroundColor: "#ffffff",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#ed3237")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = errors.address
                            ? "#ed3237"
                            : "#e5e7eb")
                        }
                      />
                      {errors.address && (
                        <p
                          className="text-sm mt-1"
                          style={{ color: "#ed3237" }}
                        >
                          {errors.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* File Uploads */}
                  <div className="space-y-6">
                    <div className="group">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#373435" }}
                      >
                        CV/Resume
                      </label>
                      <div
                        className="border-2 border-dashed rounded-xl p-6 text-center hover:border-opacity-60 transition-colors"
                        style={{ borderColor: "#848688" }}
                      >
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setCv(e.target.files?.[0] ?? null)}
                          className="hidden"
                          id="cv-upload"
                        />
                        <label
                          htmlFor="cv-upload"
                          className="cursor-pointer block"
                        >
                          <div className="mb-2" style={{ color: "#848688" }}>
                            <svg
                              className="mx-auto w-12 h-12"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                          </div>
                          <p className="text-sm" style={{ color: "#848688" }}>
                            {cv
                              ? cv.name
                              : "Click to upload CV (PDF, DOC, DOCX)"}
                          </p>
                        </label>
                      </div>
                    </div>

                    <div className="group">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#373435" }}
                      >
                        NYSC Discharge Certificate
                      </label>
                      <div
                        className="border-2 border-dashed rounded-xl p-6 text-center hover:border-opacity-60 transition-colors"
                        style={{ borderColor: "#848688" }}
                      >
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => setNysc(e.target.files?.[0] ?? null)}
                          className="hidden"
                          id="nysc-upload"
                        />
                        <label
                          htmlFor="nysc-upload"
                          className="cursor-pointer block"
                        >
                          <div className="mb-2" style={{ color: "#848688" }}>
                            <svg
                              className="mx-auto w-12 h-12"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                          </div>
                          <p className="text-sm" style={{ color: "#848688" }}>
                            {nysc
                              ? nysc.name
                              : "Click to upload NYSC Certificate"}
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={onSubmit}
                      disabled={loading}
                      className="w-full rounded-xl px-6 py-4 font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                      style={{
                        background: loading
                          ? "#848688"
                          : "linear-gradient(135deg, #ed3237 0%, #c5292e 100%)",
                        border: "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!loading)
                          e.target.style.background =
                            "linear-gradient(135deg, #c5292e 0%, #b02429 100%)";
                      }}
                      onMouseLeave={(e) => {
                        if (!loading)
                          e.target.style.background =
                            "linear-gradient(135deg, #ed3237 0%, #c5292e 100%)";
                      }}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting Application...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          Submit Application
                          <svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Success/Error Message */}
              {msg && (
                <div
                  className={`rounded-xl p-4 text-center font-medium transition-all duration-300 border ${
                    msg.startsWith("✅")
                      ? "bg-green-50 text-green-800 border-green-200"
                      : msg.startsWith("❌")
                      ? "text-white border-red-200"
                      : "bg-yellow-50 text-yellow-800 border-yellow-200"
                  }`}
                  style={
                    msg.startsWith("❌") ? { backgroundColor: "#ed3237" } : {}
                  }
                >
                  {msg}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            className="text-center mt-8 text-sm"
            style={{ color: "#848688" }}
          >
            <p>
              Need help? Contact us on{" "}
              <span style={{ color: "#ed3237" }}>
                info@peachstridesandoristine.com
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

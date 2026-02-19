// pages/admin/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import "tailwindcss/tailwind.css";

type Candidate = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  stage?: string | null;
  score?: number | null;
  passed?: boolean | null; // prisma uses "passed"
  nbcAssessmentDate?: string | null;
  nbcPassed?: boolean | null;
  interviewDate?: string | null;
  interviewLink?: string | null;
  trainingDate?: string | null;
  trainingLocation?: string | null;
  trainingPassed?: boolean | null;
  createdAt?: string;
};

type Toast = { id: string; type: "success" | "error" | "info"; text: string };

export default function AdminDashboardPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [selectedIds, setSelectedIds] = useState<Record<number, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [recentlyUpdatedIds, setRecentlyUpdatedIds] = useState<Record<number, number>>({}); // timestamp map

  // stages
  const stages = [
    "Application Received",
    "Test Scheduled",
    "Test Completed",
    "NBC Assessment",
    "Interview Scheduled",
    "Training",
    "Completed",
  ];

  // fetch -> GET /api/admin/candidates
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/candidates");
        if (!res.ok) throw new Error("Failed to fetch candidates");
        const data = await res.json();
        // normalize ISO dates to strings
        setCandidates(
          data.map((d: any) => ({
            ...d,
            nbcAssessmentDate: d.nbcAssessmentDate ?? null,
            interviewDate: d.interviewDate ?? null,
            trainingDate: d.trainingDate ?? null,
            createdAt: d.createdAt ?? null,
          }))
        );
      } catch (err) {
        pushToast("error", "Failed to load candidates");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Derived filtered candidates
  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        !searchTerm ||
        c.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = !filterStage || c.stage === filterStage;
      return matchesSearch && matchesStage;
    });
  }, [candidates, searchTerm, filterStage]);

  // Toast helpers
  function pushToast(type: Toast["type"], text: string) {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((t) => [...t, { id, type, text }]);
    // auto remove
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  }

  // open modal for candidate (prefill form)
  function openModalFor(c: Candidate) {
    setSelectedCandidate(c);
    setForm({
      stage: c.stage ?? "",
      score: c.score ?? "",
      passed: c.passed ?? null,
      nbcAssessmentDate: c.nbcAssessmentDate ? formatForInput(c.nbcAssessmentDate) : "",
      nbcPassed: c.nbcPassed ?? null,
      interviewDate: c.interviewDate ? formatForInput(c.interviewDate) : "",
      interviewLink: c.interviewLink ?? "",
      trainingDate: c.trainingDate ? formatForInput(c.trainingDate) : "",
      trainingLocation: c.trainingLocation ?? "",
      trainingPassed: c.trainingPassed ?? null,
    });
    setShowModal(true);
  }

  // convert ISO string to input-friendly local datetime-local value (YYYY-MM-DDThh:mm)
  function formatForInput(iso?: string | null) {
    if (!iso) return "";
    const d = new Date(iso);
    // to local ISO without seconds
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  // transform form -> payload: convert date inputs to ISO strings or null
  function buildPayloadFromForm() {
    const payload: any = {};
    // stage
    if (form.stage !== undefined) payload.stage = form.stage || null;
    // score
    if (form.score !== undefined) {
      const n = Number(form.score);
      payload.score = Number.isFinite(n) ? n : null;
    }
    // booleans
    if (form.passed !== undefined) payload.passed = form.passed === "" ? null : Boolean(form.passed);
    if (form.nbcPassed !== undefined) payload.nbcPassed = form.nbcPassed === "" ? null : Boolean(form.nbcPassed);
    if (form.trainingPassed !== undefined) payload.trainingPassed = form.trainingPassed === "" ? null : Boolean(form.trainingPassed);
    // string fields
    if (form.interviewLink !== undefined) payload.interviewLink = form.interviewLink || null;
    if (form.trainingLocation !== undefined) payload.trainingLocation = form.trainingLocation || null;
    // date conversions - if non-empty convert to ISO, else null
    const dateKeys = ["nbcAssessmentDate", "interviewDate", "trainingDate"];
    for (const k of dateKeys) {
      if (form[k] !== undefined) {
        payload[k] = form[k] ? new Date(form[k]).toISOString() : null;
      }
    }
    return payload;
  }

  // Single update handler -> PUT /api/admin/candidates
  async function saveCandidate() {
    if (!selectedCandidate) return;
    const payload = buildPayloadFromForm();
    try {
      const res = await fetch("/api/admin/candidates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedCandidate.id, data: payload }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        pushToast("error", `Update failed: ${err?.error || res.statusText}`);
        return;
      }
      const updated = await res.json();
      setCandidates((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      // highlight
      setRecentlyUpdatedIds((r) => ({ ...r, [updated.id]: Date.now() }));
      setTimeout(() => {
        setRecentlyUpdatedIds((r) => {
          const copy = { ...r };
          delete copy[updated.id];
          return copy;
        });
      }, 5000);
      pushToast("success", "Candidate updated");
      setShowModal(false);
      setSelectedCandidate(null);
      setForm({});
    } catch (err) {
      console.error(err);
      pushToast("error", "Update failed");
    }
  }

  // Delete candidate -> DELETE /api/admin/candidates?id=...
  async function deleteCandidate(id: number) {
    if (!confirm("Delete candidate? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/candidates?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        pushToast("error", "Delete failed");
        return;
      }
      setCandidates((p) => p.filter((c) => c.id !== id));
      pushToast("success", "Candidate deleted");
    } catch (err) {
      console.error(err);
      pushToast("error", "Delete failed");
    }
  }

  // Bulk update: iterate over selected ids and call PUT for each (simple approach)
  async function bulkUpdateStage(newStage: string) {
    const ids = Object.keys(selectedIds).filter((k) => selectedIds[Number(k)]);
    if (ids.length === 0) {
      pushToast("info", "No candidates selected");
      return;
    }
    if (!confirm(`Set stage="${newStage}" for ${ids.length} candidate(s)?`)) return;
    try {
      // call server POST /api/admin/candidates (bulk)
      const res = await fetch("/api/admin/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulkUpdate", ids: ids.map(Number), data: { stage: newStage } }),
      });
      if (!res.ok) {
        pushToast("error", "Bulk update failed");
        return;
      }
      const updatedList: Candidate[] = await res.json();
      // merge
      setCandidates((prev) => prev.map((c) => {
        const updated = updatedList.find((u) => u.id === c.id);
        return updated ? updated : c;
      }));
      // clear selection
      setSelectedIds({});
      setSelectAll(false);
      pushToast("success", `Updated ${updatedList.length} candidates`);
      // mark recently updated
      const now = Date.now();
      const map: Record<number, number> = {};
      updatedList.forEach((u) => (map[u.id] = now));
      setRecentlyUpdatedIds((r) => ({ ...r, ...map }));
      setTimeout(() => setRecentlyUpdatedIds({}), 5000);
    } catch (err) {
      console.error(err);
      pushToast("error", "Bulk update failed");
    }
  }

  // Export CSV
  function exportCSV() {
    if (candidates.length === 0) {
      pushToast("info", "No data to export");
      return;
    }
    const columns = [
      "id",
      "firstName",
      "lastName",
      "email",
      "phone",
      "stage",
      "score",
      "passed",
      "nbcAssessmentDate",
      "nbcPassed",
      "interviewDate",
      "interviewLink",
      "trainingDate",
      "trainingLocation",
      "trainingPassed",
      "createdAt",
    ];
    const rows = [columns.join(",")];
    candidates.forEach((c) => {
      const row = columns.map((col) => {
        const v = (c as any)[col];
        if (v === undefined || v === null) return "";
        // escape quotes and commas
        return `"${String(v).replace(/"/g, '""')}"`;
      });
      rows.push(row.join(","));
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `candidates_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    pushToast("success", "Export started");
  }

  // toggling selection
  function toggleSelect(id: number) {
    setSelectedIds((s) => {
      const copy = { ...s };
      copy[id] = !copy[id];
      return copy;
    });
  }
  function toggleSelectAll() {
    const newVal = !selectAll;
    setSelectAll(newVal);
    if (newVal) {
      const map: Record<number, boolean> = {};
      filtered.forEach((f) => (map[f.id] = true));
      setSelectedIds(map);
    } else {
      setSelectedIds({});
    }
  }

  // stage color helper
  function getStageColor(stage?: string | null) {
    const colors: Record<string, string> = {
      "Application Received": "#848688",
      "Test Scheduled": "#ed3237",
      "Test Completed": "#10b981",
      "NBC Assessment": "#ed3237",
      "Interview Scheduled": "#f59e0b",
      "Training": "#10b981",
      "Completed": "#10b981",
    };
    return stage ? (colors[stage] || "#848688") : "#848688";
  }

  // mark row highlight class
  function rowClassFor(id: number) {
    if (recentlyUpdatedIds[id]) {
      return "ring-2 ring-green-300";
    }
    return "";
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#ed3237 0%,#c5292e 100%)" }}>
            <svg className="animate-spin w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg" style={{ background: "linear-gradient(135deg,#ed3237 0%,#c5292e 100%)" }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6" /></svg>
          </div>
          <h1 className="text-4xl font-bold mb-1" style={{
            background: "linear-gradient(135deg,#ed3237 0%,#c5292e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>Admin Dashboard</h1>
          <p className="text-gray-600">Manage candidate pipeline — updates are saved to the DB</p>
        </div>

        {/* controls + actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/95 p-4 rounded-2xl shadow-sm border border-white/30">
            <div className="flex gap-2">
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search name or email..." className="flex-1 rounded-xl border px-3 py-2" />
              <select value={filterStage} onChange={(e) => setFilterStage(e.target.value)} className="rounded-xl border px-3 py-2">
                <option value="">All Stages</option>
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white/95 p-4 rounded-2xl shadow-sm border border-white/30 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Bulk actions</p>
              <p className="text-lg font-medium">{Object.values(selectedIds).filter(Boolean).length} selected</p>
            </div>
            <div className="flex gap-2">
              <select onChange={(e) => { if (e.target.value) bulkUpdateStage(e.target.value); e.currentTarget.value = ""; }} defaultValue="" className="rounded-xl border px-3 py-2">
                <option value="">Change stage...</option>
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={exportCSV} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Export CSV</button>
            </div>
          </div>

          <div className="bg-white/95 p-4 rounded-2xl shadow-sm border border-white/30 flex items-center justify-end gap-2">
            <button onClick={() => { setSelectedIds({}); setSelectAll(false); setFilterStage(""); setSearchTerm(""); pushToast("info", "Filters reset"); }} className="px-4 py-2 rounded-xl border">Reset</button>
            <button onClick={() => {
              // quick create demo candidate (for development)
              const newC: Candidate = {
                id: Math.max(0, ...candidates.map(c => c.id)) + 1,
                firstName: "New", lastName: "Candidate", email: `new${Date.now()}@example.com`, phone: "000",
                stage: "Application Received", createdAt: new Date().toISOString()
              };
              setCandidates(prev => [newC, ...prev]);
              pushToast("success", "Demo candidate added (client-only)");
            }} className="px-4 py-2 rounded-xl bg-green-600 text-white">Add Demo</button>
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard title="Total" value={String(candidates.length)} icon="👥" />
          <StatCard title="Passed Tests" value={String(candidates.filter(c => c.passed).length)} icon="✅" color="green" />
          <StatCard title="Interviews" value={String(candidates.filter(c => c.interviewDate).length)} icon="🎥" color="amber" />
          <StatCard title="In Training" value={String(candidates.filter(c => c.trainingDate).length)} icon="🎓" color="green" />
        </div>

        {/* table */}
        <div className="bg-white/95 rounded-2xl shadow-xl overflow-hidden border border-white/30">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                  <span className="text-sm text-gray-600">Select all (visible)</span>
                </label>
                <div className="text-sm text-gray-500">Showing {filtered.length} result(s)</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => exportCSV()} className="px-3 py-2 border rounded-xl text-sm">Export CSV</button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600" style={{ backgroundColor: "#f8f9fa" }}>
                  <th className="p-3">#</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, idx) => (
                  <tr key={c.id} className={`border-t hover:bg-gray-50 transition-colors ${rowClassFor(c.id)}`} style={{ borderColor: "#e5e7eb" }}>
                    <td className="p-3">
                      <input type="checkbox" checked={!!selectedIds[c.id]} onChange={() => toggleSelect(c.id)} />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#ed3237 0%,#c5292e 100%)" }}>
                          <span className="text-white font-medium">{c.firstName?.[0]}{c.lastName?.[0]}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{c.firstName} {c.lastName}</div>
                          <div className="text-xs text-gray-500">{new Date(c.createdAt || "").toLocaleDateString?.() || ""}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">{c.email}</div>
                      <div className="text-xs text-gray-500">{c.phone}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: getStageColor(c.stage) }}>
                        {c.stage || "—"}
                      </span>
                    </td>
                    <td className="p-3">
                      {c.score !== undefined && c.score !== null ? (
                        <div className="flex items-center gap-2">
                          <div className={`text-lg font-bold ${c.passed ? "text-green-600" : "text-red-600"}`}>{c.score}%</div>
                          <div className="text-sm">{c.passed ? "✅" : "❌"}</div>
                        </div>
                      ) : <div className="text-sm text-gray-500">—</div>}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button onClick={() => openModalFor(c)} className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm">Update</button>
                        <button onClick={() => deleteCandidate(c.id)} className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Modal */}
      {showModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Update: {selectedCandidate.firstName} {selectedCandidate.lastName}</h2>
              <div className="flex gap-2">
                <button onClick={() => { setShowModal(false); setSelectedCandidate(null); }} className="px-3 py-2 rounded-full border">Close</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Stage</label>
                <select className="w-full rounded-xl border px-3 py-2" value={form.stage ?? ""} onChange={(e) => setForm({...form, stage: e.target.value})}>
                  <option value="">Select stage</option>
                  {stages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Test Score</label>
                <input type="number" min={0} max={100} value={form.score ?? ""} onChange={(e) => setForm({...form, score: e.target.value})} className="w-full rounded-xl border px-3 py-2" placeholder="e.g. 85" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Passed Test</label>
                <select className="w-full rounded-xl border px-3 py-2" value={form.passed === null || form.passed === undefined ? "" : String(form.passed)} onChange={(e) => setForm({...form, passed: e.target.value === "" ? "" : e.target.value === "true"})}>
                  <option value="">Unknown</option>
                  <option value="true">Pass</option>
                  <option value="false">Fail</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">NBC Passed</label>
                <select className="w-full rounded-xl border px-3 py-2" value={form.nbcPassed === null || form.nbcPassed === undefined ? "" : String(form.nbcPassed)} onChange={(e) => setForm({...form, nbcPassed: e.target.value === "" ? "" : e.target.value === "true"})}>
                  <option value="">Unknown</option>
                  <option value="true">Pass</option>
                  <option value="false">Fail</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">NBC Assessment Date</label>
                <input value={form.nbcAssessmentDate ?? ""} onChange={(e) => setForm({...form, nbcAssessmentDate: e.target.value})} type="datetime-local" className="w-full rounded-xl border px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Interview Date</label>
                <input value={form.interviewDate ?? ""} onChange={(e) => setForm({...form, interviewDate: e.target.value})} type="datetime-local" className="w-full rounded-xl border px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Interview Link</label>
                <input value={form.interviewLink ?? ""} onChange={(e) => setForm({...form, interviewLink: e.target.value})} type="url" placeholder="https://..." className="w-full rounded-xl border px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Training Date</label>
                <input value={form.trainingDate ?? ""} onChange={(e) => setForm({...form, trainingDate: e.target.value})} type="datetime-local" className="w-full rounded-xl border px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Training Location</label>
                <input value={form.trainingLocation ?? ""} onChange={(e) => setForm({...form, trainingLocation: e.target.value})} type="text" placeholder="e.g. Lagos Training Center" className="w-full rounded-xl border px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Training Passed</label>
                <select className="w-full rounded-xl border px-3 py-2" value={form.trainingPassed === null || form.trainingPassed === undefined ? "" : String(form.trainingPassed)} onChange={(e) => setForm({...form, trainingPassed: e.target.value === "" ? "" : e.target.value === "true"})}>
                  <option value="">Unknown</option>
                  <option value="true">Pass</option>
                  <option value="false">Fail</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => { if (selectedCandidate) deleteCandidate(selectedCandidate.id); }} className="px-4 py-2 rounded-xl bg-red-600 text-white">Delete</button>
              <button onClick={() => { setShowModal(false); setSelectedCandidate(null); }} className="px-4 py-2 rounded-xl border">Cancel</button>
              <button onClick={() => saveCandidate()} className="px-4 py-2 rounded-xl bg-green-600 text-white">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed top-6 right-6 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-2 rounded-lg shadow ${t.type === "success" ? "bg-green-600 text-white" : t.type === "error" ? "bg-red-600 text-white" : "bg-gray-700 text-white"}`}>
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// small stat card
function StatCard({ title, value, icon, color = "gray" }: { title: string; value: string; icon?: string; color?: string }) {
  const colorMap: Record<string, string> = { gray: "#848688", green: "#10b981", amber: "#f59e0b", indigo: "#6366f1" };
  return (
    <div className="bg-white/95 p-4 rounded-2xl shadow-sm border border-white/30 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold" style={{ color: "#373435" }}>{value}</p>
      </div>
      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colorMap[color] || colorMap.gray }}>
        <span className="text-white">{icon}</span>
      </div>
    </div>
  );
}

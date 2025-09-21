import React, { useState } from "react";

interface Achievement {
  id: number;
  title: string;
  activityType: string;
  studentId: string;
  studentName: string;
  verified: boolean;
}

export default function App() {
  const [role, setRole] = useState<"student" | "admin">("student");
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [form, setForm] = useState({
    title: "",
    activityType: "",
    studentId: "",
    studentName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.activityType) return;
    setAchievements([
      ...achievements,
      {
        id: Date.now(),
        ...form,
        verified: false,
      },
    ]);
    setForm({ title: "", activityType: "", studentId: "", studentName: "" });
  };

  const handleVerify = (id: number) =>
    setAchievements(
      achievements.map((a) => (a.id === id ? { ...a, verified: true } : a))
    );

  const handleDelete = (id: number) =>
    setAchievements(achievements.filter((a) => a.id !== id));

  const downloadCSV = () => {
    const headers = ["ID", "Title", "Type", "Student", "Verified"];
    const rows = achievements.map((a) => [
      a.id,
      a.title,
      a.activityType,
      a.studentName,
      a.verified ? "Yes" : "No",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "achievements.csv";
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-sky-700 text-white py-4 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
          <h1 className="text-xl font-bold">StuTrack</h1>
          <div>
            <button
              onClick={() => setRole("student")}
              className={`px-3 py-1 rounded-l ${
                role === "student" ? "bg-white text-sky-700" : "bg-sky-600"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`px-3 py-1 rounded-r ${
                role === "admin" ? "bg-white text-sky-700" : "bg-sky-600"
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Section */}
        <section>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-3">Student Dashboard</h2>
            {role === "student" && (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Achievement Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Activity Type"
                  value={form.activityType}
                  onChange={(e) =>
                    setForm({ ...form, activityType: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Student ID"
                  value={form.studentId}
                  onChange={(e) =>
                    setForm({ ...form, studentId: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Student Name"
                  value={form.studentName}
                  onChange={(e) =>
                    setForm({ ...form, studentName: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-600 text-white rounded"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        title: "",
                        activityType: "",
                        studentId: "",
                        studentName: "",
                      })
                    }
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Reset
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4">
              <h3 className="font-semibold">My Achievements</h3>
              <ul className="mt-2 space-y-2">
                {achievements
                  .filter((a) => a.studentId === form.studentId || role === "admin")
                  .map((a) => (
                    <li
                      key={a.id}
                      className="p-2 border rounded flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{a.title}</div>
                        <div className="text-xs text-gray-500">
                          {a.activityType} • {a.studentName}
                        </div>
                        <div
                          className={`text-xs ${
                            a.verified ? "text-green-600" : "text-yellow-600"
                          }`}
                        >
                          {a.verified ? "Verified" : "Pending"}
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Admin Section */}
        <aside>
          {role === "admin" && (
            <div className="bg-white rounded-lg shadow p-4 space-y-4">
              <h3 className="font-semibold">Admin Panel</h3>
              <div className="text-sm text-gray-600">Pending verification</div>
              <div className="mt-3 space-y-2">
                {achievements.filter((a) => !a.verified).map((p) => (
                  <div
                    key={p.id}
                    className="p-2 border rounded flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-gray-500">
                        {p.studentName} • {p.activityType}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerify(p.id)}
                        className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {achievements.filter((a) => !a.verified).length === 0 && (
                  <div className="text-xs text-gray-400">No pending items</div>
                )}
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium">Reports</h4>
                <div className="mt-2 flex flex-col gap-2">
                  <button
                    onClick={downloadCSV}
                    className="px-3 py-2 bg-green-600 text-white rounded"
                  >
                    Export All CSV
                  </button>
                  <button
                    onClick={() =>
                      alert("PDF export stub - implement on backend")
                    }
                    className="px-3 py-2 bg-indigo-600 text-white rounded"
                  >
                    Export PDF (demo)
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-8 text-center text-xs text-gray-400">
        Prototype • Designed for demo purposes
      </footer>
    </div>
  );
}

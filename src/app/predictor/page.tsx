"use client";

import { useState } from "react";
import CollegeCard from "@/components/CollegeCard";
import { GraduationCap, AlertCircle, HelpCircle } from "lucide-react";

export default function PredictorPage() {
  const [examName, setExamName] = useState("JEE Main");
  const [rank, setRank] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<any[] | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResults(null);
    setMessage("");

    const rankNum = parseInt(rank, 10);
    if (isNaN(rankNum) || rankNum <= 0) {
      setError("Please enter a valid positive rank number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ examName, rank: rankNum }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Prediction failed.");
      }

      const data = await res.json();
      setResults(data.colleges);
      setMessage(data.message);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve predictions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
      {/* Title */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-white flex items-center justify-center sm:justify-start space-x-2">
          <GraduationCap className="h-8 w-8 text-yellow-400" />
          <span>College Predictor Tool</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Estimate your admission chances by entering your exam type and rank.
        </p>
      </div>

      {/* Main Form */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl mb-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Exam Name Select */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Select Entrance Exam</label>
              <select
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="JEE Main">JEE Main</option>
                <option value="JEE Advanced">JEE Advanced (for IITs)</option>
              </select>
            </div>

            {/* Rank Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">Enter Your CRL Rank</label>
              <input
                type="number"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="e.g. 5240"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-sm placeholder-slate-500"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 bg-red-950/40 border border-red-800/80 text-red-400 p-4 rounded-lg text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 hover:cursor-pointer text-white font-semibold py-3 rounded-lg transition-colors text-sm disabled:opacity-55"
          >
            {loading ? "Analyzing Cutoffs..." : "Predict Colleges"}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {results !== null && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-white">Recommendations</h2>
            <p className="text-slate-400 text-xs mt-1">{message}</p>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {results.map((college) => (
                <CollegeCard
                  key={college.id}
                  id={college.id}
                  name={college.name}
                  location={college.location}
                  fees={college.fees}
                  rating={college.rating}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
              <HelpCircle className="h-12 w-12 mx-auto text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No Matching Colleges</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                No top colleges in our directory match this rank category. Try typing a lower rank or selecting a different exam.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

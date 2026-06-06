"use client";

import { useEffect, useState } from "react";
import { Star, MapPin, IndianRupee, Trophy, GraduationCap, GitCompare } from "lucide-react";

export default function ComparePage() {
  const [collegesList, setCollegesList] = useState<any[]>([]);
  const [collegeAId, setCollegeAId] = useState("");
  const [collegeBId, setCollegeBId] = useState("");
  const [collegeA, setCollegeA] = useState<any>(null);
  const [collegeB, setCollegeB] = useState<any>(null);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch("/api/colleges?limit=100");
        if (res.ok) {
          const data = await res.json();
          setCollegesList(data.colleges || []);
        }
      } catch (error) {
        console.error("Error fetching college list for dropdowns:", error);
      } finally {
        setLoadingList(false);
      }
    };
    fetchList();
  }, []);

  useEffect(() => {
    if (!collegeAId) {
      setCollegeA(null);
      return;
    }
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/colleges/${collegeAId}`);
        if (res.ok) {
          const data = await res.json();
          setCollegeA(data);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    fetchDetail();
  }, [collegeAId]);

  useEffect(() => {
    if (!collegeBId) {
      setCollegeB(null);
      return;
    }
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/colleges/${collegeBId}`);
        if (res.ok) {
          const data = await res.json();
          setCollegeB(data);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    fetchDetail();
  }, [collegeBId]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white flex items-center space-x-2">
          <GitCompare className="h-7 w-7 text-blue-400" />
          <span>Compare Colleges</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Select any two colleges to compare their parameters side-by-side</p>
      </div>

      {/* Select Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-300">Select College A</label>
          <select
            value={collegeAId}
            onChange={(e) => setCollegeAId(e.target.value)}
            disabled={loadingList}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="">-- Choose College --</option>
            {collegesList.map((c) => (
              <option key={c.id} value={c.id} disabled={c.id === collegeBId}>
                {c.name} ({c.location})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-300">Select College B</label>
          <select
            value={collegeBId}
            onChange={(e) => setCollegeBId(e.target.value)}
            disabled={loadingList}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="">-- Choose College --</option>
            {collegesList.map((c) => (
              <option key={c.id} value={c.id} disabled={c.id === collegeAId}>
                {c.name} ({c.location})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Container */}
      {collegeA || collegeB ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-300 text-sm">
                  <th className="p-4 w-1/4 font-semibold">Criteria</th>
                  <th className="p-4 w-3/8 font-bold text-blue-400">{collegeA ? collegeA.name : "College A (Not Selected)"}</th>
                  <th className="p-4 w-3/8 font-bold text-emerald-400">{collegeB ? collegeB.name : "College B (Not Selected)"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {/* Location */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400 flex items-center space-x-1.5">
                    <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Location</span>
                  </td>
                  <td className="p-4 text-white font-medium">{collegeA ? collegeA.location : "-"}</td>
                  <td className="p-4 text-white font-medium">{collegeB ? collegeB.location : "-"}</td>
                </tr>

                {/* Rating */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400 flex items-center space-x-1.5">
                    <Star className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Rating</span>
                  </td>
                  <td className="p-4 text-white font-medium">
                    {collegeA ? (
                      <div className="flex items-center space-x-1 text-yellow-400 font-bold">
                        <span>{collegeA.rating.toFixed(1)}</span>
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-4 text-white font-medium">
                    {collegeB ? (
                      <div className="flex items-center space-x-1 text-yellow-400 font-bold">
                        <span>{collegeB.rating.toFixed(1)}</span>
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>

                {/* Fees */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400 flex items-center space-x-1.5">
                    <IndianRupee className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Fees (per year)</span>
                  </td>
                  <td className="p-4 text-white font-semibold">
                    {collegeA ? `₹ ${collegeA.fees.toLocaleString("en-IN")}` : "-"}
                  </td>
                  <td className="p-4 text-white font-semibold">
                    {collegeB ? `₹ ${collegeB.fees.toLocaleString("en-IN")}` : "-"}
                  </td>
                </tr>

                {/* Placements */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400 flex items-center space-x-1.5">
                    <Trophy className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Placements</span>
                  </td>
                  <td className="p-4 text-slate-300 leading-relaxed max-w-xs align-top py-4">
                    {collegeA ? (
                      <div className="text-xs space-y-1">
                        {collegeA.placements.split(",").map((p: string, i: number) => (
                          <div key={i} className="pb-1">{p.trim()}</div>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-4 text-slate-300 leading-relaxed max-w-xs align-top py-4">
                    {collegeB ? (
                      <div className="text-xs space-y-1">
                        {collegeB.placements.split(",").map((p: string, i: number) => (
                          <div key={i} className="pb-1">{p.trim()}</div>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>

                {/* Courses */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400 flex items-center space-x-1.5">
                    <GraduationCap className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Key Courses</span>
                  </td>
                  <td className="p-4 text-slate-300 align-top py-4">
                    {collegeA ? (
                      <div className="flex flex-wrap gap-1">
                        {collegeA.courses.split(",").slice(0, 4).map((c: string, i: number) => (
                          <span key={i} className="bg-slate-805 text-[10px] text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                            {c.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-4 text-slate-300 align-top py-4">
                    {collegeB ? (
                      <div className="flex flex-wrap gap-1">
                        {collegeB.courses.split(",").slice(0, 4).map((c: string, i: number) => (
                          <span key={i} className="bg-slate-805 text-[10px] text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                            {c.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <GitCompare className="h-12 w-12 mx-auto text-slate-655 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No colleges selected</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Choose two engineering colleges from the dropdown selections above to generate a side-by-side comparison.
          </p>
        </div>
      )}
    </div>
  );
}

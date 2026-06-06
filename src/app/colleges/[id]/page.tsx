"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { Star, MapPin, IndianRupee, Heart, GraduationCap, Trophy, Users, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { status } = useSession();

  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "reviews">("overview");

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/colleges/${id}`);
      if (!res.ok) throw new Error("College not found");
      const data = await res.json();
      setCollege(data);
      setIsSaved(data.isSaved);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id, status]);

  const handleSaveToggle = async () => {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/colleges/${id}`);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/colleges/${id}/save`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.saved);
      }
    } catch (error) {
      console.error("Failed to toggle save", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm">Loading college details...</p>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">College Not Found</h2>
        <p className="text-slate-400">The college you are looking for does not exist in our directory.</p>
        <Link href="/colleges" className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
      {/* Back link */}
      <Link href="/colleges" className="inline-flex items-center space-x-1 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Directory</span>
      </Link>

      {/* College Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-3">
            <span className="bg-blue-900/50 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-800 font-semibold inline-block">
              Engineering College
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{college.name}</h1>
            
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-300">
              <div className="flex items-center space-x-1.5">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{college.location}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <IndianRupee className="h-4 w-4 text-slate-400 shrink-0" />
                <span>₹ {college.fees.toLocaleString("en-IN")} / year</span>
              </div>
              <div className="flex items-center space-x-1 text-yellow-400">
                <Star className="h-4 w-4 fill-yellow-400" />
                <span className="font-semibold">{college.rating.toFixed(1)} / 5.0</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveToggle}
            disabled={saving}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all border cursor-pointer ${
              isSaved
                ? "bg-red-950/40 border-red-800 text-red-400 hover:bg-red-900/40"
                : "bg-blue-600 border-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-red-400 text-red-450" : "text-white"}`} />
            <span>{saving ? "Processing..." : isSaved ? "Saved" : "Save College"}</span>
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900 overflow-x-auto">
          {(["overview", "courses", "placements", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[100px] text-center py-4 text-sm font-semibold capitalize border-b-2 transition-all cursor-pointer ${
                activeTab === tab
                  ? "border-blue-500 text-blue-400 bg-slate-950/20"
                  : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="p-6 sm:p-8 min-h-[250px]">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-blue-400" />
                <span>Overview</span>
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">{college.overview}</p>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <span>Offered Courses</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {college.courses.split(",").map((course: string, index: number) => (
                  <div key={index} className="bg-slate-950/40 border border-slate-800 p-3.5 rounded-lg text-sm text-slate-300">
                    {course.trim()}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "placements" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-blue-400" />
                <span>Placement Statistics</span>
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line bg-slate-950/40 border border-slate-800 p-5 rounded-lg">
                {college.placements}
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-400" />
                <span>Student Reviews</span>
              </h2>
              <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-lg space-y-3">
                <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="font-bold text-white">Student Body Choice</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-sm italic">
                  &ldquo;{college.reviews}&rdquo;
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

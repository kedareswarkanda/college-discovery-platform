"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CollegeCard from "@/components/CollegeCard";
import { Heart, Lock } from "lucide-react";
import Link from "next/link";

export default function SavedCollegesPage() {
  const { data: session, status } = useSession();
  const [savedColleges, setSavedColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedColleges = async () => {
    try {
      const res = await fetch("/api/colleges/saved");
      if (res.ok) {
        const data = await res.json();
        setSavedColleges(data);
      }
    } catch (error) {
      console.error("Failed to fetch saved colleges:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchSavedColleges();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  if (status === "loading" || (loading && status === "authenticated")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 flex-grow">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm">Loading saved colleges...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6 flex-grow flex flex-col justify-center">
        <div className="inline-flex p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-450 mx-auto">
          <Lock className="h-8 w-8 text-slate-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Authentication Required</h2>
          <p className="text-slate-400 text-sm">
            Please log in to view and manage your saved favorites.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/login" className="bg-blue-600 hover:bg-blue-500 hover:cursor-pointer text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            Login
          </Link>
          <Link href="/signup" className="bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-750 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
      <div className="mb-8 border-b border-slate-900 pb-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center space-x-2">
          <Heart className="h-7 w-7 text-red-500 fill-red-500" />
          <span>My Saved Colleges</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Keep track of your top-tier college choices.</p>
      </div>

      {savedColleges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedColleges.map((college) => (
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
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <Heart className="h-12 w-12 mx-auto text-slate-700 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Your list is empty</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
            Click the "Save College" button on any college detail page to bookmark it here.
          </p>
          <Link href="/colleges" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            Explore Colleges
          </Link>
        </div>
      )}
    </div>
  );
}

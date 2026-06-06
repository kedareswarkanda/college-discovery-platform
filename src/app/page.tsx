import Link from "next/link";
import prisma from "@/lib/prisma";
import CollegeCard from "@/components/CollegeCard";
import { Search, GraduationCap, GitCompare, Landmark } from "lucide-react";

export default async function Home() {
  let featuredColleges: any[] = [];
  try {
    featuredColleges = await prisma.college.findMany({
      orderBy: { rating: "desc" },
      take: 3,
    });
  } catch (error) {
    console.error("Error fetching featured colleges:", error);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-900 border-b border-slate-800 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Find Your Dream <span className="text-blue-400">Engineering College</span> in India
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Discover detailed profiles of top IITs, NITs, and IIITs. Compare fees, ratings, placements, and predict your match based on JEE rank.
          </p>

          {/* Quick Search Widget */}
          <form action="/colleges" method="GET" className="max-w-xl mx-auto mt-8 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                name="search"
                placeholder="Search by college name, e.g. IIT Bombay..."
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm placeholder-slate-500"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm shrink-0 hover:cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-12">
          Key Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all text-center space-y-4">
            <div className="inline-flex p-3 bg-blue-900/45 border border-blue-800 rounded-lg text-blue-400">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Smart Search & Filters</h3>
            <p className="text-slate-400 text-sm">
              Filter colleges instantly by location (city), fees, and rating. Our server-side filtering retrieves results in real-time.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all text-center space-y-4">
            <div className="inline-flex p-3 bg-yellow-900/40 border border-yellow-850 rounded-lg text-yellow-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">College Predictor</h3>
            <p className="text-slate-400 text-sm">
              Enter your JEE Main or JEE Advanced rank to find which tier of colleges (IITs, NITs, or IIITs) you qualify for based on historical cuts.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all text-center space-y-4">
            <div className="inline-flex p-3 bg-indigo-900/40 border border-indigo-850 rounded-lg text-indigo-400">
              <GitCompare className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Side-by-Side Comparison</h3>
            <p className="text-slate-400 text-sm">
              Select any two colleges to compare their academic fees, ratings, placement metrics, and review highlights side-by-side.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="bg-slate-900/40 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Institutions</h2>
              <p className="text-slate-400 text-sm mt-1">Explore some of the highest-rated colleges in our platform</p>
            </div>
            <Link
              href="/colleges"
              className="text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors"
            >
              View All Colleges &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredColleges.length > 0 ? (
              featuredColleges.map((college) => (
                <CollegeCard
                  key={college.id}
                  id={college.id}
                  name={college.name}
                  location={college.location}
                  fees={college.fees}
                  rating={college.rating}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-slate-900 border border-slate-800 rounded-lg">
                <Landmark className="h-10 w-10 mx-auto text-slate-600 mb-3" />
                <p className="text-slate-400">No colleges seeded yet. Seeding the database will show colleges here.</p>
                <code className="text-xs text-slate-500 block mt-2">Run: npx prisma db seed</code>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

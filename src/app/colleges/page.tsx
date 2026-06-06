"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CollegeCard from "@/components/CollegeCard";
import { Search, MapPin, SlidersHorizontal, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

function CollegesList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [minFees, setMinFees] = useState(searchParams.get("minFees") || "0");
  const [maxFees, setMaxFees] = useState(searchParams.get("maxFees") || "600000");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "0");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));

  const [colleges, setColleges] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        city,
        minFees,
        maxFees,
        minRating,
        page: page.toString(),
        limit: "6",
      });

      const res = await fetch(`/api/colleges?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch colleges");
      const data = await res.json();
      setColleges(data.colleges);
      setTotalPages(data.totalPages);
      setTotalItems(data.total);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    if (minFees && minFees !== "0") params.set("minFees", minFees);
    if (maxFees && maxFees !== "600000") params.set("maxFees", maxFees);
    if (minRating && minRating !== "0") params.set("minRating", minRating);
    if (page > 1) params.set("page", page.toString());
    
    router.replace(`/colleges?${params.toString()}`, { scroll: false });
  }, [search, city, minFees, maxFees, minRating, page]);

  const handleReset = () => {
    setSearch("");
    setCity("");
    setMinFees("0");
    setMaxFees("600000");
    setMinRating("0");
    setPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchColleges();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Find Engineering Colleges</h1>
          <p className="text-slate-400 text-sm mt-1">Browse, filter, and discover colleges matching your criteria</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center space-x-1 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg border border-slate-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6 self-start">
          <div className="flex items-center space-x-2 text-white font-bold border-b border-slate-800 pb-3">
            <SlidersHorizontal className="h-5 w-5 text-blue-400" />
            <h2>Filters</h2>
          </div>

          {/* Search by City */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              City / Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
                placeholder="e.g. Mumbai, Bangalore..."
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-600"
              />
            </div>
          </div>

          {/* Fee Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Max Annual Fees
              </label>
              <span className="text-xs font-bold text-blue-400">
                ₹ {parseInt(maxFees).toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="600000"
              step="10000"
              value={maxFees}
              onChange={(e) => {
                setMaxFees(e.target.value);
                setPage(1);
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>₹ 10k</span>
              <span>₹ 6L+</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => {
                setMinRating(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="0">Any Rating</option>
              <option value="4.0">4.0 ★ & Above</option>
              <option value="4.5">4.5 ★ & Above</option>
              <option value="4.7">4.7 ★ & Above</option>
            </select>
          </div>
        </div>

        {/* Listing Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Main search bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by college name, short abbreviation..."
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Load indicator / list */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-5 animate-pulse space-y-4">
                  <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                  <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                  <div className="h-8 bg-slate-700 rounded w-full mt-6"></div>
                </div>
              ))}
            </div>
          ) : colleges.length > 0 ? (
            <>
              <div className="text-slate-400 text-xs font-semibold mb-2">
                Found {totalItems} college{totalItems !== 1 ? "s" : ""}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {colleges.map((college) => (
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

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 pt-8 border-t border-slate-950">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="flex items-center space-x-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-slate-800 text-white rounded-lg text-sm transition-colors border border-slate-700 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>
                  <span className="text-sm text-slate-300">
                    Page <strong className="text-white">{page}</strong> of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="flex items-center space-x-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-slate-800 text-white rounded-lg text-sm transition-colors border border-slate-700 cursor-pointer"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-xl">
              <Search className="h-12 w-12 mx-auto text-slate-655 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No colleges found</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                No institutions match your search filters. Try adjusting your sliders, picking a broader location, or clearing search.
              </p>
              <button
                onClick={handleReset}
                className="mt-6 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg border border-slate-700 text-sm font-semibold transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400 text-sm animate-pulse">Loading college catalog...</div>
      </div>
    }>
      <CollegesList />
    </Suspense>
  );
}

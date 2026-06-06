"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, Landmark, Heart, GitCompare, GraduationCap } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight text-blue-400">
              <Landmark className="h-6 w-6" />
              <span>CampusFind</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/colleges" className="hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Find Colleges
                </Link>
                <Link href="/compare" className="flex items-center space-x-1 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <GitCompare className="h-4 w-4" />
                  <span>Compare</span>
                </Link>
                <Link href="/predictor" className="flex items-center space-x-1 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <GraduationCap className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">Predictor</span>
                </Link>
                {status === "authenticated" && (
                  <Link href="/saved" className="flex items-center space-x-1 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                    <span>Saved Colleges</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {status === "loading" ? (
                <span className="text-slate-400 text-sm">Loading...</span>
              ) : status === "authenticated" ? (
                <div className="flex items-center space-x-4">
                  <span className="text-slate-300 text-sm">{session?.user?.email}</span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-md shadow-blue-900/35"
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/colleges"
            onClick={() => setIsOpen(false)}
            className="block hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md text-base font-medium"
          >
            Find Colleges
          </Link>
          <Link
            href="/compare"
            onClick={() => setIsOpen(false)}
            className="block hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md text-base font-medium"
          >
            Compare
          </Link>
          <Link
            href="/predictor"
            onClick={() => setIsOpen(false)}
            className="block text-yellow-400 hover:bg-slate-800 px-3 py-2 rounded-md text-base font-medium"
          >
            Predictor
          </Link>
          {status === "authenticated" && (
            <Link
              href="/saved"
              onClick={() => setIsOpen(false)}
              className="block hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              Saved Colleges
            </Link>
          )}
          <hr className="border-slate-800 my-2" />
          {status === "authenticated" ? (
            <div className="space-y-2 px-3">
              <p className="text-slate-400 text-sm truncate">{session?.user?.email}</p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full text-center bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-base font-medium transition-all cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 px-3 pt-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-slate-300 hover:text-white py-2 text-base font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md text-base font-medium transition-all"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

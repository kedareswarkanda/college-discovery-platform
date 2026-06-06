import { Landmark } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 text-white font-bold mb-4 md:mb-0">
          <Landmark className="h-5 w-5 text-blue-400" />
          <span>CampusFind</span>
        </div>
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} CampusFind. All rights reserved. Built for evaluation.
        </p>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Star, MapPin, IndianRupee } from "lucide-react";

interface CollegeCardProps {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
}

export default function CollegeCard({ id, name, location, fees, rating }: CollegeCardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-slate-600 transition-all">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="bg-blue-900/50 text-blue-300 text-xs px-2.5 py-0.5 rounded-full border border-blue-800 font-semibold">
            Engineering
          </span>
          <div className="flex items-center text-yellow-400 space-x-1">
            <Star className="h-4 w-4 fill-yellow-400" />
            <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2" title={name}>
          {name}
        </h3>
        
        <div className="space-y-2 text-slate-300 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <span>{location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <IndianRupee className="h-4 w-4 text-slate-400 shrink-0" />
            <span>₹ {fees.toLocaleString("en-IN")} / year</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-0">
        <Link
          href={`/colleges/${id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-500 hover:cursor-pointer text-white py-2 rounded-md font-medium transition-colors text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

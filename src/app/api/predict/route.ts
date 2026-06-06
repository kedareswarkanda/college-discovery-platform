import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { examName, rank } = await req.json();

    if (!examName || rank === undefined || rank === null) {
      return NextResponse.json(
        { error: "Exam name and rank are required" },
        { status: 400 }
      );
    }

    const rankNum = parseInt(rank, 10);
    if (isNaN(rankNum) || rankNum <= 0) {
      return NextResponse.json(
        { error: "Rank must be a positive number" },
        { status: 400 }
      );
    }

    const colleges = await prisma.college.findMany();
    let recommendedKeywords: string[] = [];

    if (examName === "JEE Advanced") {
      if (rankNum <= 500) {
        recommendedKeywords = ["bombay", "delhi", "madras"];
      } else if (rankNum <= 1500) {
        recommendedKeywords = ["bombay", "delhi", "madras", "kanpur", "kharagpur"];
      } else if (rankNum <= 3000) {
        recommendedKeywords = ["kharagpur", "roorkee", "guwahati", "hyderabad"];
      } else if (rankNum <= 6000) {
        recommendedKeywords = ["guwahati", "hyderabad", "roorkee"];
      }

      const filtered = colleges.filter(c => 
        c.name.toLowerCase().includes("indian institute of technology") &&
        recommendedKeywords.some(keyword => c.name.toLowerCase().includes(keyword))
      );

      return NextResponse.json({
        examName,
        rank: rankNum,
        colleges: filtered,
        message: filtered.length > 0 
          ? `Top IITs recommended for JEE Advanced Rank ${rankNum}`
          : "Your rank is outside the typical range for top IITs. Try entering a JEE Main rank to view NITs/IIITs."
      });
    } else {
      // JEE Main
      if (rankNum <= 1000) {
        recommendedKeywords = ["hyderabad", "trichy"]; // IIIT Hyd, NIT Trichy
      } else if (rankNum <= 5000) {
        recommendedKeywords = ["trichy", "surathkal", "warangal", "bangalore", "allahabad", "hyderabad"];
      } else if (rankNum <= 15000) {
        recommendedKeywords = ["surathkal", "warangal", "rourkela", "calicut", "gwalior", "delhi technological", "netaji", "jadavpur"];
      } else if (rankNum <= 30000) {
        recommendedKeywords = ["coep", "jadavpur", "rv college", "psg", "pilani"];
      } else {
        recommendedKeywords = ["vellore", "rv college", "psg"];
      }

      const filtered = colleges.filter(c => 
        !c.name.toLowerCase().includes("indian institute of technology") && // exclude IITs for JEE Main
        recommendedKeywords.some(keyword => c.name.toLowerCase().includes(keyword))
      );

      return NextResponse.json({
        examName,
        rank: rankNum,
        colleges: filtered,
        message: filtered.length > 0 
          ? `NITs, IIITs, and State/Private colleges recommended for JEE Main Rank ${rankNum}`
          : "Recommendations based on your rank."
      });
    }
  } catch (error: any) {
    console.error("Predictor API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

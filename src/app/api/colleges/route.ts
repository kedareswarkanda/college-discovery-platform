import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const city = searchParams.get("city") || "";
    const minFees = parseInt(searchParams.get("minFees") || "0", 10);
    const maxFees = parseInt(searchParams.get("maxFees") || "10000000", 10);
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);

    const skip = (page - 1) * limit;

    const where: any = {
      fees: {
        gte: minFees,
        lte: maxFees,
      },
      rating: {
        gte: minRating,
      },
    };

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (city) {
      where.location = {
        contains: city,
        mode: "insensitive",
      };
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        skip,
        take: limit,
        orderBy: { rating: "desc" },
      }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({
      colleges,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Fetch colleges error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

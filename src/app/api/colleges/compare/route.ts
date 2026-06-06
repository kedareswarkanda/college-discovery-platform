import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idsString = searchParams.get("ids") || "";
    const ids = idsString.split(",").filter(Boolean);

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "No college IDs provided" },
        { status: 400 }
      );
    }

    const colleges = await prisma.college.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json(colleges);
  } catch (error: any) {
    console.error("Compare colleges error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

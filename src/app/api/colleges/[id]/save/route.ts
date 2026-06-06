import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: collegeId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const existingSave = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: user.id,
          collegeId: collegeId,
        },
      },
    });

    if (existingSave) {
      await prisma.savedCollege.delete({
        where: {
          userId_collegeId: {
            userId: user.id,
            collegeId: collegeId,
          },
        },
      });
      return NextResponse.json({ saved: false, message: "College removed from saved list" });
    } else {
      await prisma.savedCollege.create({
        data: {
          userId: user.id,
          collegeId: collegeId,
        },
      });
      return NextResponse.json({ saved: true, message: "College saved successfully" });
    }
  } catch (error: any) {
    console.error("Save college toggle error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

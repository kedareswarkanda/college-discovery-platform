import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    const college = await prisma.college.findUnique({
      where: { id },
    });

    if (!college) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    let isSaved = false;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (user) {
        const saved = await prisma.savedCollege.findUnique({
          where: {
            userId_collegeId: {
              userId: user.id,
              collegeId: id,
            },
          },
        });
        isSaved = !!saved;
      }
    }

    return NextResponse.json({ ...college, isSaved });
  } catch (error: any) {
    console.error("Fetch college detail error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

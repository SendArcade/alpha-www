import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET recent public projects
export async function GET(request: Request) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        private: false, // Only get public projects
      },
      take: 15, // Limit to 15 projects
      orderBy: {
        createdAt: "desc", // Most recent first
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            dislikes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

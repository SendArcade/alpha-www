import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";

// POST to dislike a project
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user already disliked the project
    const existingDislike = await prisma.dislike.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: params.id,
        },
      },
    });

    if (existingDislike) {
      return NextResponse.json(
        { error: "Project already disliked" },
        { status: 400 }
      );
    }

    // Remove like if exists
    await prisma.like.deleteMany({
      where: {
        userId: user.id,
        projectId: params.id,
      },
    });

    // Create dislike
    const dislike = await prisma.dislike.create({
      data: {
        userId: user.id,
        projectId: params.id,
      },
    });

    return NextResponse.json(dislike);
  } catch (error) {
    return NextResponse.json(
      { error: "Error disliking project" },
      { status: 500 }
    );
  }
}

// DELETE to remove dislike from a project
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete dislike
    await prisma.dislike.deleteMany({
      where: {
        userId: user.id,
        projectId: params.id,
      },
    });

    return NextResponse.json({ message: "Dislike removed successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error removing dislike" },
      { status: 500 }
    );
  }
}

// GET to check if user disliked a project and get total dislikes
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    // Count total dislikes
    const dislikesCount = await prisma.dislike.count({
      where: { projectId: params.id },
    });

    // If no user is logged in, just return the count
    if (!session?.user) {
      return NextResponse.json({
        dislikesCount,
        userDisliked: false,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({
        dislikesCount,
        userDisliked: false,
      });
    }

    // Check if user disliked the project
    const userDislike = await prisma.dislike.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: params.id,
        },
      },
    });

    return NextResponse.json({
      dislikesCount,
      userDisliked: !!userDislike,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching dislikes" },
      { status: 500 }
    );
  }
}

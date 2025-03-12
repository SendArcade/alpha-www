import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";

// POST to like a project
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

    // Check if user already liked the project
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: params.id,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { error: "Project already liked" },
        { status: 400 }
      );
    }
    const existingDislike = await prisma.dislike.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: params.id,
        },
      },
    });

    // Remove dislike if exists
    if (existingDislike) {
      await prisma.dislike.deleteMany({
        where: {
          userId: user.id,
          projectId: params.id,
        },
      });
    }

    // Create like
    const like = await prisma.like.create({
      data: {
        userId: user.id,
        projectId: params.id,
      },
    });

    return NextResponse.json(like);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error liking project" },
      { status: 500 }
    );
  }
}

// DELETE to unlike a project
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

    // Delete like
    await prisma.like.deleteMany({
      where: {
        userId: user.id,
        projectId: params.id,
      },
    });

    return NextResponse.json({ message: "Project unliked successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error unliking project" },
      { status: 500 }
    );
  }
}

// GET to check if user liked a project and get total likes
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    // Count total likes
    const likesCount = await prisma.like.count({
      where: { projectId: params.id },
    });

    // If no user is logged in, just return the count
    if (!session?.user) {
      return NextResponse.json({
        likesCount,
        userLiked: false,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({
        likesCount,
        userLiked: false,
      });
    }

    // Check if user liked the project
    const userLike = await prisma.like.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: params.id,
        },
      },
    });

    return NextResponse.json({
      likesCount,
      userLiked: !!userLike,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching likes" },
      { status: 500 }
    );
  }
}

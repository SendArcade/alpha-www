import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// PUT to update a comment
export async function PUT(
  req: Request,
  { params }: { params: { id: string; commentId: string } }
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

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Verify comment ownership
    if (comment.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const { content } = json;

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Update comment
    const updatedComment = await prisma.comment.update({
      where: { id: params.commentId },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating comment" },
      { status: 500 }
    );
  }
}

// DELETE a comment
export async function DELETE(
  req: Request,
  { params }: { params: { id: string; commentId: string } }
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

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Verify comment ownership or project ownership
    if (comment.userId !== user.id) {
      // Check if user is the project owner
      const project = await prisma.project.findUnique({
        where: { id: params.id },
      });

      if (!project || project.userId !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Delete comment
    await prisma.comment.delete({
      where: { id: params.commentId },
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting comment" },
      { status: 500 }
    );
  }
}

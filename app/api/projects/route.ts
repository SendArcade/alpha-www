import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

// GET all public projects
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";

    let query = prisma.project.findMany({
      take: 40,
      orderBy: {
        createdAt: "desc",
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
      where: {
        AND: [
          { private: false }, // Only get public projects
          {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          },
          category !== "all"
            ? {
                category: category,
              }
            : {},
        ],
      },
    });

    const projects = await query;

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST new project
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const { title, imageUrl, category, description, private: isPrivate } = json;

    if (!title || !imageUrl || !category || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const project = await prisma.project.create({
      data: {
        title,
        imageUrl,
        category,
        description,
        private: isPrivate || false,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Error creating project" },
      { status: 500 }
    );
  }
}

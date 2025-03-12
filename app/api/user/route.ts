import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();

  if (!session || !session.user) {
    return new NextResponse(
      JSON.stringify({ error: "You must be logged in." }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email!,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession();

  if (!session || !session.user) {
    return new NextResponse(
      JSON.stringify({ error: "You must be logged in." }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { name, bio, location, image } = body;

    const user = await prisma.user.update({
      where: {
        email: session.user?.email!,
      },
      data: {
        name,
        bio,
        location,
        image,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new NextResponse(
      JSON.stringify({ error: "You must be logged in." }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const body = await request.json();
    // Your POST route logic here
    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

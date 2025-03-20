import { prisma } from "@/src/lib/prisma";
import { hashPassword } from "@/src/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password, token } = await req.json();

    if (!name || !email || !password || !token) {
      return NextResponse.json(
        { error: "Name, email, password, and token are required" },
        { status: 400 }
      );
    }

    // Validate the invitation token
    const invitation = await prisma.invitation.findUnique({
      where: {
        token,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invalid invitation token" },
        { status: 404 }
      );
    }

    if (invitation.used) {
      return NextResponse.json(
        { error: "Invitation has already been used" },
        { status: 400 }
      );
    }

    if (invitation.expires < new Date()) {
      return NextResponse.json(
        { error: "Invitation has expired" },
        { status: 400 }
      );
    }

    if (invitation.email !== email) {
      return NextResponse.json(
        { error: "Email does not match the invitation" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create the user
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: invitation.role,
      },
    });

    // Mark the invitation as used
    await prisma.invitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        used: true,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}

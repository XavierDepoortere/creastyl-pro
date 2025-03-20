import { prisma } from "@/src/lib/prisma";
import { hashPassword } from "@/src/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Check if a superadmin already exists
    const existingSuperAdmin = await prisma.user.findFirst({
      where: {
        role: "SUPERADMIN",
      },
    });

    if (existingSuperAdmin) {
      console.log("Le superadministrateur existe déjà");
      return NextResponse.json(
        { error: "Le superadministrateur existe déjà" },
        { status: 400 }
      );
    }

    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "L'email et le mot de passe sont requis" },
        { status: 400 }
      );
    }

    // Create the superadmin user
    const hashedPassword = await hashPassword(password);

    const superadmin = await prisma.user.create({
      data: {
        email,
        name: name || "Super Admin",
        password: hashedPassword,
        role: "SUPERADMIN",
      },
    });

    return NextResponse.json(
      {
        message: "Superadministrateur créé avec succès",
        userId: superadmin.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création du superadministrateur:", error);
    return NextResponse.json(
      { error: "Échec de la création du superadministrateur" },
      { status: 500 }
    );
  }
}

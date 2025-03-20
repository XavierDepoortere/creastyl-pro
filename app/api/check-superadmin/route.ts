import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Vérifier si un superadministrateur existe
    const superadmin = await prisma.user.findFirst({
      where: {
        role: "SUPERADMIN",
      },
    });

    return NextResponse.json({
      hasSuperAdmin: !!superadmin,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la vérification du superadministrateur:",
      error
    );
    return NextResponse.json(
      { error: "Échec de la vérification", hasSuperAdmin: false },
      { status: 500 }
    );
  }
}

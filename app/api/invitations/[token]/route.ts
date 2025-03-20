import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    console.log("Validation du token:", token);

    if (!token) {
      return NextResponse.json({ error: "Token requis" }, { status: 400 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: {
        token: token,
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Token invalide" }, { status: 404 });
    }

    if (invitation.used) {
      return NextResponse.json(
        { error: "Invitation déjà utilisée" },
        { status: 410 }
      );
    }

    if (invitation.expires < new Date()) {
      return NextResponse.json(
        { error: "Invitation has expired" },
        { status: 400 }
      );
    }
    const result = {
      email: invitation.email,
      role: invitation.role,
    };

    console.log("Résultat de validation:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur lors de la validation du token:", error);
    return NextResponse.json(
      { error: "Erreur lors de la validation du token" },
      { status: 500 }
    );
  }
}

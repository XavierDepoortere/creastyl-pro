import { prisma } from "@/src/lib/prisma";
import { generateRandomToken } from "@/src/lib/utils";
import nodemailer from "nodemailer";
import { requireAdmin } from "@/src/lib/auth";
import { NextResponse } from "next/server";
import { addDays } from "date-fns";
import { render } from "@react-email/render";
import EmailInvitation from "../../../components/email/EmailInvitation";
import { ReactElement } from "react";

export async function POST(req: Request) {
  try {
    const currentUser = await requireAdmin();

    const { email, role = "USER" } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
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

    // Check if there's an active invitation
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        used: false,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: "An active invitation already exists for this email" },
        { status: 400 }
      );
    }

    // Create a new invitation
    const token = generateRandomToken();
    const expires = addDays(new Date(), 1);

    const invitation = await prisma.invitation.create({
      data: {
        email,
        token,
        role: role === "ADMIN" ? "ADMIN" : "USER", // Only allow USER or ADMIN roles
        expires,
        createdBy: currentUser.id,
      },
    });

    // Send invitation email
    const invitationLink = `${process.env.NEXTAUTH_URL}/register?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.ionos.fr", // Serveur SMTP de IONOS (à vérifier dans votre compte)
      port: 465, // Port TLS standard (ou 465 pour SSL)
      secure: true, // true pour 465, false pour les autres ports

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      debug: true,
    });

    const emailHtml = await render(
      EmailInvitation({ invitationLink }) as ReactElement
    );

    await transporter.sendMail({
      from: "contact@xavier-depoortere.fr", // Votre adresse email
      to: email, // Adresse email de destination
      subject: "Bienvenue à Next.js",
      html: emailHtml,
    });
    return NextResponse.json(
      { message: "Email envoyé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Il y a une erreur coté serveur:", error);
    return NextResponse.json(
      { message: "Erreur serveur", error },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const invitations = await prisma.invitation.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sender: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}

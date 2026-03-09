"use server";

import { NextResponse } from "next/server";
import VerifyAccountEmail from "@/emails/verify-account-email";
import { getInfosBarbershop } from "@/shared/actions/get-infos-barbershop";
import { authClient } from "../auth-client";
import { transporter } from "../transporter.mail";

interface SendVerificationEmailParams {
  to: string[];
  userName?: string;
  token: string;
}

export async function sendVerificationEmail({
  to,
  userName,
  token,
}: SendVerificationEmailParams) {
  try {
    if (!to || to.length === 0 || !token) {
      return NextResponse.json(
        { error: "Email and token are required." },
        { status: 400 },
      );
    }

    const info = await getInfosBarbershop();
    const shopName = info?.name ?? "";

    const html = VerifyAccountEmail({
      token,
      barbershopName: shopName,
      userName,
    });

    const mailInfo = await transporter.sendMail({
      from: `${shopName || "Barbearia"} <${process.env.EMAIL_USER}>`,
      to,
      subject: `Verificação de conta${shopName ? ` - ${shopName}` : ""}`,
      html,
    });

    return NextResponse.json({ success: true, messageId: mailInfo.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 },
    );
  }
}

export async function verifyEmail(token: string) {
  const res = await authClient.verifyEmail({
    query: { token },
  });

  if (res.error) {
    throw new Error(res.error.message);
  }

  return res;
}

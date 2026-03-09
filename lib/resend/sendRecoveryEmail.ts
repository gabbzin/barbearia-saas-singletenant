"use server";

import { NextResponse } from "next/server";
import TemplateEmailRecoverPass from "@/emails/recover-password-email";
import { getInfosBarbershop } from "@/shared/actions/get-infos-barbershop";
import { transporter } from "../transporter.mail";

interface SendVerificationEmailParams {
  to: string[];
  userName?: string;
  token: string;
}

export async function sendRecoveryEmail({
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

    const html = TemplateEmailRecoverPass({
      barbershopName: shopName,
      userName,
      token,
    });

    const mailInfo = await transporter.sendMail({
      from: `${shopName || "Barbearia"} <${process.env.EMAIL_USER}>`,
      to,
      subject: `Recuperação de senha${shopName ? ` - ${shopName}` : ""}`,
      html,
    });
    return NextResponse.json({ success: true, messageId: mailInfo.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send recovery email" },
      { status: 500 },
    );
  }
}

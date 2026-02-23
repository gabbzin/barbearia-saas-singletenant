"use server";

import { NextResponse } from "next/server";
import TemplateEmailRecoverPass from "@/emails/recover-password-email";
import { getInfosBarbershop } from "@/shared/actions/get-infos-barbershop";
import { resendClient } from "../resend-client";

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
    if (!to || !token) {
      return NextResponse.json(
        { error: "Email and token are required." },
        { status: 400 },
      );
    }

    const info = await getInfosBarbershop();
    const shopName = info?.name ?? "";

    const { data, error } = await resendClient.emails.send({
      from: `${shopName || "Barbearia"} <onboarding@resend.dev>`,
      to,
      subject: `Recuperação de senha${shopName ? ` - ${shopName}` : ""}`,
      react: TemplateEmailRecoverPass({
        barbershopName: shopName,
        userName,
        token,
      }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

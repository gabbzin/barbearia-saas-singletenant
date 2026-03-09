import { baseUrl } from "@/lib/consts";
import { imagePaths } from "@/shared/constants/images";

interface TemplateEmailPageProps {
  barbershopName?: string;
  userName?: string;
  token: string;
}

export default function TemplateEmailRecoverPass({
  barbershopName = "",
  userName,
  token,
}: TemplateEmailPageProps): string {
  const safeUserName = userName ?? "Usuário";
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charSet="UTF-8" />
    <title>Recuperar Senha</title>
  </head>
  <body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;padding:20px 0;">
    <div style="background-color:#ffffff;margin:0 auto;max-width:600px;width:100%;">
      <img src="${imagePaths.backgroundMail}" alt="Head" width="600" style="max-width:100%;height:auto;display:block;margin:0 auto;" />
      <hr style="border-color:#e6ebf1;margin:24px 0;" />
      <div style="padding:0 24px;">
        <h1 style="font-size:22px;margin-bottom:12px;text-align:center;">Recuperar Senha</h1>
        <p style="color:#525f7f;font-size:16px;line-height:24px;text-align:center;">
          Olá ${safeUserName}, recebemos uma solicitação para recuperar a senha da sua conta.
        </p>
        <p style="color:#525f7f;font-size:16px;line-height:24px;text-align:center;">
          Para realiza-lá, pedimos que você clique no link abaixo.
        </p>
        <a href="${baseUrl}/reset-password?token=${token}" style="background-color:#656ee8;border-radius:6px;color:#fff;font-size:16px;font-weight:bold;text-decoration:none;display:block;width:100%;padding:12px 0;text-align:center;margin-top:20px;">
          Redefinir Senha
        </a>
      </div>
      <hr style="border-color:#e6ebf1;margin:24px 0;" />
      <div style="padding:24px;text-align:center;background-color:#000;">
        <img src="${imagePaths.closed}" alt="closed" width="200" style="max-width:100%;height:auto;display:block;margin:0 auto;" />
        <p style="color:#ffffff;font-size:14px;margin-top:12px;">
          © ${year} ${barbershopName}
        </p>
        <p style="color:#8898aa;font-size:12px;line-height:16px;">
          Todos os direitos reservados.
        </p>
        <img src="${imagePaths.dividerDown}" alt="divider" width="600" style="max-width:100%;height:auto;display:block;margin:0 auto;" />
      </div>
    </div>
  </body>
</html>`;
}

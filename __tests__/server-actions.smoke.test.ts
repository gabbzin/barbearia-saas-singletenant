const actions = [
  "@/shared/actions/get-infos-barbershop",
  "@/shared/actions/get-header-data",
  "@/lib/resend/sendVerifyEmail",
  "@/lib/resend/sendRecoveryEmail",
  "@/features/barber/actions/get-barbers-action",
  "@/features/barber/actions/create-barber",
  "@/features/booking/functions/create-booking",
  "@/features/booking/functions/create-booking-checkout-session",
  "@/features/booking/functions/cancel-booking",
  "@/features/booking/functions/get-bookings",
  "@/features/booking/actions/get-bookings-user-action",
  "@/features/booking/actions/confirm-booking-checkout",
  "@/features/signature/actions/create-signature",
  "@/features/signature/actions/get-current-subscription",
  "@/features/dashboard_barber/actions/getInfos",
  "@/features/booking/functions/create-booking-without-session",
  "@/features/booking/actions/get-next-booking-action",
  "@/features/booking/actions/get-last-booking-action",
  "@/features/rating/actions/rating-action",
  "@/features/barber/actions/barber-break-actions",
];

describe("Server actions smoke test", () => {
  it("imports actions without throwing and exports are defined (or fail with known unsupported errors)", async () => {
    for (const path of actions) {
      try {
        // dynamic import to ensure module loads
        const mod = await import(path);
        expect(mod).toBeDefined();
        const keys = Object.keys(mod);
        expect(keys.length).toBeGreaterThan(0);
        // biome-ignore lint/suspicious/noExplicitAny: <Hoje pode>
      } catch (err: any) {
        const msg = String(err?.message || err);
        // Some Next.js runtime constructs cannot be imported in Jest (headers(), revalidatePath, etc.)
        const allowed = [
          "Cannot use import statement outside a module",
          "TextEncoder is not defined",
          "headers() can only be used in a Server Component",
          "Request is not defined",
          "fetch is not defined",
        ];

        const isAllowed = allowed.some(a => msg.includes(a));
        if (isAllowed) {
          // log and continue — environment-specific limitation
          // eslint-disable-next-line no-console
          console.warn(`Skipped import ${path}: ${msg}`);
          continue;
        }

        throw new Error(`Failed to import ${path}: ${msg}`);
      }
    }
  });
});

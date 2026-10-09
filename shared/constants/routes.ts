export const publicRoutes = {
  profile: "/profile",
};

export const authRoutes = {
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
};

export const clientRoutes = {
  dashboard: "/client",
  bookings: "/client/bookings",
  signature: "/client/signature",
  barberDetails: (id: string) => `/client/barbeiro/${id}`,
  barberLucas: "/client/barbeiro/922e50cd-6c1a-4223-a7e0-5e2d0af99545",
  barberDetailsconst: "/client/barbeiro/[id]",
} as const;

export const barberRoutes = {
  dashboard: "/barber/dashboard",
  schedule: "/barber/schedule",
  exceptions: "/barber/exceptions",
} as const;

export const adminRoutes = {
  dashboard: "/admin",
} as const;

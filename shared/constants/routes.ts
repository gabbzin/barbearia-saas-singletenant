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
  barberLucas: "/client/barbeiro/1d75280e-61a4-420b-8b7b-1a6f4718256d",
  barberDetailsconst: "/client/barbeiro/[id]",
} as const;

export const barberRoutes = {
  dashboard: "/barber/dashboard",
  schedule: "/barber/schedule",
} as const;

export const adminRoutes = {
  dashboard: "/admin",
} as const;

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
  barberLucas: "/client/barbeiro/78cf8826-1ac5-400d-9d64-e693f2582459",
  barberDetailsconst: "/client/barbeiro/[id]",
} as const;

export const barberRoutes = {
  dashboard: "/barber/dashboard",
  schedule: "/barber/schedule",
} as const;

export const adminRoutes = {
  dashboard: "/admin",
} as const;

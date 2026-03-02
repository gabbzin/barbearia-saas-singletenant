export const publicRoutes = {
  profile: "/profile",
};

export const clientRoutes = {
  dashboard: "/client",
  bookings: "/client/bookings",
  signature: "/client/signature",
  barberDetails: (id: string) => `/client/barbeiro/${id}`,
  barberDetailsconst: "/client/barbeiro/[id]",
} as const;

export const barberRoutes = {
  dashboard: "/barber",
  schedule: "/barber/schedule",
} as const;

export const adminRoutes = {
  dashboard: "/admin",
} as const;

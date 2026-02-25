export const clientRoutes = {
  dashboard: "/client",
  bookings: "/client/bookings",
  signature: "/client/signature",
  profile: "/client/profile",
  barberDetails: (id: string) => `/client/barbeiro/${id}`,
} as const;

export const barberRoutes = {
  dashboard: "/barber",
} as const;

export const adminRoutes = {
  dashboard: "/admin",
} as const;

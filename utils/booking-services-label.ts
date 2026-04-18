type ServiceLike = {
  name: string;
};

const FALLBACK_SERVICE_LABEL = "Servico";

export function getBookingServiceShortLabel(services?: ServiceLike[] | null) {
  if (!services || services.length === 0) {
    return FALLBACK_SERVICE_LABEL;
  }

  const firstServiceName = services[0]?.name?.trim() || FALLBACK_SERVICE_LABEL;

  if (services.length === 1) {
    return firstServiceName;
  }

  return `${firstServiceName} +${services.length - 1}`;
}

export function getBookingServiceFullLabel(services?: ServiceLike[] | null) {
  if (!services || services.length === 0) {
    return FALLBACK_SERVICE_LABEL;
  }

  const names = services
    .map(service => service.name?.trim())
    .filter((name): name is string => Boolean(name));

  if (names.length === 0) {
    return FALLBACK_SERVICE_LABEL;
  }

  return names.join(", ");
}

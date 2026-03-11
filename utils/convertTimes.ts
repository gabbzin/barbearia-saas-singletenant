export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Função para converter minutos de volta para "HH:mm"
export const minutesToTime = (minutes: number) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

export const createRange = (start: string, end: string) => ({
  start: timeToMinutes(start),
  end: timeToMinutes(end),
});

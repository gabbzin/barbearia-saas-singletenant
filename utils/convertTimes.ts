export const timeToMinutes = (time: string | Date) => {
  if (time instanceof Date) {
    return time.getUTCHours() * 60 + time.getUTCMinutes();
  }

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

export const createRange = (start: string | Date, end: string | Date) => ({
  start: timeToMinutes(start),
  end: timeToMinutes(end),
});

export const timeStringToDate = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0, 0));
};

export const timeDateToString = (time: Date) => {
  const hours = time.getUTCHours().toString().padStart(2, "0");
  const minutes = time.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

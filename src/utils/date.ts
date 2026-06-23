const getTimeZoneOffset = (): string => {
  const offsetMinutes = -new Date().getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const hours = Math.floor(Math.abs(offsetMinutes) / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (Math.abs(offsetMinutes) % 60).toString().padStart(2, '0');

  return `i-GMT${sign}${hours}${minutes === '00' ? '' : `:${minutes}`}`;
};

const isSameDay = (first: Date, second: Date): boolean =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const isYesterday = (date: Date, today: Date): boolean => {
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return isSameDay(date, yesterday);
};

const formatTime = (date: Date): string =>
  date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const time = formatTime(date);
  const timeZone = getTimeZoneOffset();

  if (isSameDay(date, now)) {
    return `Сегодня, ${time} ${timeZone}`;
  }

  if (isYesterday(date, now)) {
    return `Вчера, ${time} ${timeZone}`;
  }

  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0 && diffDays < 7) {
    return `${diffDays} ${getDayWord(diffDays)} назад, ${time} ${timeZone}`;
  }

  return `${date.toLocaleDateString('ru-RU')}, ${time} ${timeZone}`;
};

const getDayWord = (days: number): string => {
  const mod10 = days % 10;
  const mod100 = days % 100;

  if (mod100 >= 11 && mod100 <= 14) {
    return 'дней';
  }

  if (mod10 === 1) {
    return 'день';
  }

  if (mod10 >= 2 && mod10 <= 4) {
    return 'дня';
  }

  return 'дней';
};

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
const TIMEZONE = 'Asia/Kuala_Lumpur';
dayjs.extend(timezone);
dayjs.extend(utc);
const customDayjs = dayjs;
// export const formatDateTime = (c: dayjs.ConfigType) =>
//   customDayjs(c).tz(TIMEZONE).format('YYYY-MM-DD HH:mm');

export const formatFullDateTime = (c: dayjs.ConfigType) =>
  customDayjs(c).tz(TIMEZONE).format('DD MMM YYYY, HH:mm A');

export const formatDate = (c: dayjs.ConfigType) =>
  customDayjs(c).tz(TIMEZONE).format('YYYY-MM-DD');

export const formatFullDate = (c: dayjs.ConfigType) =>
  customDayjs(c).tz(TIMEZONE).format('DD MMM YYYY');

export const formatMonthYear = (c: dayjs.ConfigType) =>
  customDayjs(c).tz(TIMEZONE).format('MMMM YYYY');

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const number = new Intl.NumberFormat('en-US').format;
export const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
}).format;
export const dateLabel = value => value?.slice(0, 10) || '—';
export const inputDate = date => date.toISOString().slice(0, 10);
export function initialRange() {
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 179);
  return {
    start: inputDate(start),
    end: inputDate(end),
    period: 'month'
  };
}
export const categories = ['Sales', 'Users', 'Traffic', 'Finance'];
export const reportTypes = ['Summary', 'Detailed'];
export const statuses = ['Draft', 'Published', 'Archived'];

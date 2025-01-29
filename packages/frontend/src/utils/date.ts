export function getMaxDate(dates: Date[]) {
  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

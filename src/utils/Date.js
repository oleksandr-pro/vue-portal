export const formatDate = (date, withTime = false,preventOldDate=false) => {
  if (!date) return date;
  let d = new Date(date);
  if (d == 'Invalid Date' ||(preventOldDate && d.getTime() === new Date(0).getTime())) return '';
  let month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear(),
    hour = d.getHours(),
    minute = d.getMinutes();
  hour = hour.toString().length === 2 ? hour : '0' + hour;
  minute = minute.toString().length === 2 ? minute : '0' + minute;
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return withTime ? `${[year, month, day].join('-')}  ${[hour, minute].join(':')}` : [year, month, day].join('-');
}

function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 6000);
}
module.exports = { AddMinutesToDate };

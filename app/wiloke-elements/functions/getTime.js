import moment from "moment";
import momentTimeZone from "moment-timezone";

export const getTime = timestamp =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

export const getTodayTimeZone = zone => {
  const today = moment().format();
  const todayOnZone = momentTimeZone.tz(today, zone).format();
  return moment(todayOnZone).unix();
};
export const compareDate = (date1, date2, zone) => {
  const today = moment().format("YYYY-MM-DD");
  const time1 = momentTimeZone.tz(`${today} ${date1}`, zone).format();
  const timeUnix1 = moment(time1).unix();
  const todayUnix = getTodayTimeZone();
  const time2 = momentTimeZone.tz(`${today} ${date2}`, zone).format();
  const timeUnix2 = moment(time2).unix();
  if (timeUnix2 < timeUnix1) {
    const time3 = momentTimeZone.tz(moment(time2).add(1, "day"), zone).format();
    const timeUnix3 = moment(time3).unix();
    return timeUnix1 < todayUnix && todayUnix < timeUnix3;
  }
  return timeUnix1 < todayUnix && todayUnix < timeUnix2;
};
export const getBusinessStatus = (dayOfWeek, zone) => {
  const data = Object.keys(dayOfWeek);
  return data.reduce((isOpen, day, index) => {
    const today = momentTimeZone.tz(moment(), zone).format("dddd");
    if (today.toLowerCase() === day) {
      if (dayOfWeek[day].isOpen === "yes") {
        return (isOpen = !dayOfWeek[day].secondOpenHour
          ? compareDate(
              dayOfWeek[day].firstOpenHour,
              dayOfWeek[day].firstCloseHour,
              zone
            )
          : compareDate(
              dayOfWeek[day].firstOpenHour,
              dayOfWeek[day].firstCloseHour,
              zone
            ) ||
            compareDate(
              dayOfWeek[day].secondOpenHour,
              dayOfWeek[day].secondCloseHour,
              zone
            ));
      } else {
        return (isOpen = "day_off");
      }
    }
    return isOpen;
  }, false);
};

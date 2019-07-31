import moment from "moment";

const utcOffset = moment().utcOffset();
const invertedOffset =
    Math.sign(utcOffset) === -1 ? Math.abs(utcOffset) : 0 - utcOffset;
const offset = invertedOffset / 60;

const today = moment()
    .add(1, "day")
    .seconds(0);
const startDay = today
    .startOf("isoWeek")
    .subtract(1, "day")
    .add(7, "day");

export const offsetTime = (days, time) => {
    const timeString = `${startDay.clone().format("YYYY-MM-DD")}T${time}:00Z`;
    const output = moment(timeString)
        .add(days, "days")
        .add(offset, "hours");
    return output.utc().format();
};

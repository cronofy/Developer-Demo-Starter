import moment from "moment";
import { switchcase } from "./utils";

export const meetingTypeChange = target => {
    const participantsWrapper = document.querySelector(
        ".js--meeting-participants__wrapper"
    );

    const locationWrapper = document.querySelector(
        ".js--meeting-location__wrapper"
    );

    const eventTitleInput = document.querySelector(".js--meeting-name");

    const eventTitleOptions = {
        "1to1": "Weekly catchup",
        appraisal: "Quarterly appraisal",
        team: "Team meeting"
    };
    const eventTitle = switchcase(eventTitleOptions)("")(target);
    eventTitleInput.value = eventTitle;

    if (target === "1to1") {
        participantsWrapper.classList.add("block--hidden");
        locationWrapper.classList.add("block--hidden");
    } else {
        participantsWrapper.classList.remove("block--hidden");
        locationWrapper.classList.remove("block--hidden");
    }
};

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

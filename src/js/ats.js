import { offsetTime } from "./sales.utils";
import {
    buildSelect,
    buildSelectToggler,
    watchSelectToggler
} from "./multiselect";

console.log("SUB", SUB);

TEAM[0].selected = true;
buildSelect("ats", TEAM, SUB);
buildSelectToggler("ats", TEAM, SUB);
watchSelectToggler("ats", TEAM, checkSubs, SUB);

const interviewState = {
    type: "remote",
    required: "all",
    location: false,
    name: false
};

// Toggle visibility of inputs based on Meeting Type:
const meetingTypeToggle = document.querySelectorAll(".js--interview-type");
[...meetingTypeToggle].map(typeToggle =>
    typeToggle.addEventListener("change", e => {
        const target = e.target.value;
        interviewState.type = target;

        updateQuery(interviewState);
    })
);

// Setup the Availability Viewer UI Element

const availabilityQuery = {
    participants: [
        {
            required: interviewState.required
        }
    ],
    required_duration: { minutes: 30 },
    available_periods: [
        { start: offsetTime(1, "08:00"), end: offsetTime(1, "18:00") },
        { start: offsetTime(2, "08:00"), end: offsetTime(2, "18:00") },
        { start: offsetTime(3, "08:00"), end: offsetTime(3, "18:00") },
        { start: offsetTime(4, "08:00"), end: offsetTime(4, "18:00") },
        { start: offsetTime(5, "08:00"), end: offsetTime(5, "18:00") },
        { start: offsetTime(6, "08:00"), end: offsetTime(6, "18:00") },
        { start: offsetTime(7, "08:00"), end: offsetTime(7, "18:00") },
        { start: offsetTime(8, "08:00"), end: offsetTime(8, "18:00") },
        { start: offsetTime(9, "08:00"), end: offsetTime(9, "18:00") },
        { start: offsetTime(10, "08:00"), end: offsetTime(10, "18:00") },
        { start: offsetTime(11, "08:00"), end: offsetTime(11, "18:00") },
        { start: offsetTime(12, "08:00"), end: offsetTime(12, "18:00") }
    ]
};

// const userParticipant = {
//     sub: SUB,
//     managed_availability: true,
//     availability_rule_ids: ["team_work_hours"]
// };

const subItems = document.querySelectorAll(".js--multiselect__item");
const firstLoadSubs = [...subItems].map(item => item.dataset["atsSub"]);

const members = firstLoadSubs
    .filter(sub => typeof sub === "string")
    .map(sub => {
        return {
            sub,
            managed_availability: true,
            availability_rule_ids: ["team_work_hours"]
        };
    });
availabilityQuery.participants[0].members = members;

const availabilityOptions = {
    element_token: TOKEN,
    target_id: "cronofy-ats-availability",
    api_domain: API_DOMAIN,
    availability_query: availabilityQuery,
    config: {
        start_time: "08:00",
        end_time: "18:00",
        interval: 30
    },
    styles: {
        prefix: "AV1"
    },
    callback: slot => interviewSubmit(slot)
};

const originalOptions = { ...availabilityOptions };
const Viewer = CronofyElements.AvailabilityViewer(originalOptions);

const availabilityCheckboxes = document.querySelectorAll(
    ".js--ats-availability"
);
[...availabilityCheckboxes].map(checkbox =>
    checkbox.addEventListener("change", checkAvailabilityRequired)
);

function checkAvailabilityRequired() {
    const checkboxes = document.querySelectorAll(".js--ats-availability");
    const activeCheckbox = [...checkboxes].find(checkbox => checkbox.checked);
    interviewState.required =
        activeCheckbox.value === "all" ? activeCheckbox.value : 1;
    updateQuery(interviewState);
}

function updateQuery(state) {
    const duration = state.type === "remote" ? 30 : 60;
    availabilityOptions.availability_query.required_duration.minutes = duration;
    availabilityOptions.availability_query.participants[0].required =
        state.required;
    const updatedOptions = { ...availabilityOptions };
    Viewer.update(updatedOptions);
}

function interviewSubmit(res) {
    if (res.notification.type !== "slot_selected") return;
    const slot = JSON.stringify(res.notification.slot);
    const title = "Interview confirmed";
    const name = "Nitithorn Prinya";
    const location = interviewState.type !== "remote" ? "Evenitron HQ" : false;
    const type = "interview-confirm";
    const redirectQuery = `type=${type}&slot=${slot}&title=${title}&name=${name}&location=${location}`;
    window.location.href = `/email?${redirectQuery}`;
}

function checkSubs() {
    const subItems = document.querySelectorAll(".js--multiselect__item");
    const subs = [...subItems].map(item => item.dataset["atsSub"]);

    const newMembers = subs
        .filter(sub => typeof sub === "string")
        .map(sub => {
            return {
                sub,
                managed_availability: true,
                availability_rule_ids: ["team_work_hours"]
            };
        });

    availabilityQuery.participants[0].members = newMembers;
    const updatedOptions = { ...availabilityOptions };
    Viewer.update(updatedOptions);
}

const selfScheduleTriggers = document.querySelectorAll(".js--self-schedule");
[...selfScheduleTriggers].map(trigger =>
    trigger.addEventListener("click", sendSelfScheduleEmail)
);

function sendSelfScheduleEmail() {
    const query = JSON.stringify(availabilityQuery);
    const type = "interview";
    window.location.href = `/email?type=${type}&query=${query}`;
}

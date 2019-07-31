import { meetingTypeChange, offsetTime } from "./sales.utils";
import {
    buildSelect,
    buildSelectToggler,
    clearParticipants,
    watchSelectToggler
} from "./multiselect";

TEAM[0].selected = true;
buildSelect("meeting", TEAM, SUB);
buildSelectToggler("meeting", TEAM, SUB);
watchSelectToggler("meeting", TEAM, checkSubs, SUB);

const meetingState = {
    type: "1to1",
    location: false,
    name: NAME,
    title: false
};

// Toggle visibility of inputs based on Meeting Type:
const meetingTypeToggle = document.querySelectorAll(".js--meeting-type");
[...meetingTypeToggle].map(typeToggle =>
    typeToggle.addEventListener("change", e => {
        const target = e.target.value;
        meetingTypeChange(target);
        meetingState.type = target;
        updateQuery(meetingState);
    })
);

// Setup the Availability Viewer UI Element

const availabilityQuery = {
    participants: [
        {
            required: "all"
        }
    ],
    required_duration: { minutes: 60 },
    available_periods: [
        { start: offsetTime(1, "09:00"), end: offsetTime(1, "17:30") },
        { start: offsetTime(2, "08:00"), end: offsetTime(2, "17:30") },
        { start: offsetTime(3, "09:00"), end: offsetTime(3, "17:30") },
        { start: offsetTime(4, "09:00"), end: offsetTime(4, "17:30") },
        { start: offsetTime(5, "09:00"), end: offsetTime(5, "17:30") },
        { start: offsetTime(8, "09:00"), end: offsetTime(8, "17:30") },
        { start: offsetTime(9, "09:00"), end: offsetTime(9, "17:30") },
        { start: offsetTime(10, "09:00"), end: offsetTime(10, "17:30") },
        { start: offsetTime(11, "09:00"), end: offsetTime(11, "17:30") },
        { start: offsetTime(12, "09:00"), end: offsetTime(12, "17:30") }
    ]
};

const userParticipant = {
    sub: SUB,
    managed_availability: true,
    availability_rule_ids: ["team_work_hours"]
};

availabilityQuery.participants[0].members = [userParticipant];

const availabilityOptions = {
    element_token: TOKEN,
    target_id: "cronofy-meeting-availability",
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
    callback: slot => meetingSubmit(slot)
};

const originalOptions = { ...availabilityOptions };
const Viewer = CronofyElements.AvailabilityViewer(originalOptions);

const nameInput = document.querySelector(".js--meeting-name");
nameInput.addEventListener("change", e => {
    meetingState.title = e.target.value;
});
const locationInput = document.querySelector(".js--meeting-location");
locationInput.addEventListener("change", e => {
    meetingState.location = e.target.value;
});

function updateQuery(state) {
    const duration = state.type === "1to1" ? 30 : 60;
    if (state.type === "1to1") {
        availabilityOptions.availability_query.participants[0].members = [
            userParticipant
        ];
        clearParticipants("meeting", TEAM, SUB);
    }
    availabilityOptions.availability_query.required_duration.minutes = duration;
    const updatedOptions = { ...availabilityOptions };
    Viewer.update(updatedOptions);
}

function meetingSubmit(res) {
    if (res.notification.type !== "slot_selected") return;
    const slot = JSON.stringify(res.notification.slot);
    const title = meetingState.title;
    const name = meetingState.name;
    const location =
        meetingState.type !== "1to1" ? meetingState.location : false;
    const meetingType = meetingState.type;
    const type = "meeting-confirm";
    const redirectQuery = `type=${type}&slot=${slot}&title=${title}&name=${name}&location=${location}&meetingtype=${meetingType}`;
    window.location.href = `/email?${redirectQuery}`;
}

function checkSubs() {
    const subItems = document.querySelectorAll(".js--multiselect__item");
    const subs = [...subItems].map(item => item.dataset["meetingSub"]);

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

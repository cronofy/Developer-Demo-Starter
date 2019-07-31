import { offsetTime } from "./sales.utils";

// The logged in user is the first entry in the team list - let's remove them...
const team = TEAM.slice(1, TEAM.length);

const availabilityQuery = {
    participants: [
        {
            required: "all"
        }
    ],
    required_duration: { minutes: 30 },
    available_periods: [
        { start: offsetTime(0, "08:00"), end: offsetTime(0, "18:00") },
        { start: offsetTime(1, "08:00"), end: offsetTime(1, "18:00") },
        { start: offsetTime(2, "08:00"), end: offsetTime(2, "18:00") },
        { start: offsetTime(3, "08:00"), end: offsetTime(3, "18:00") },
        { start: offsetTime(4, "08:00"), end: offsetTime(4, "18:00") },
        { start: offsetTime(5, "08:00"), end: offsetTime(5, "18:00") },
        { start: offsetTime(6, "08:00"), end: offsetTime(6, "18:00") }
    ]
};

const buildUserParticipant = sub => ({
    sub,
    managed_availability: true,
    availability_rule_ids: ["team_work_hours"]
});

availabilityQuery.participants[0].members = [buildUserParticipant(team[0].sub)];

const availabilityOptions = {
    element_token: TOKEN,
    target_id: "cronofy-team-availability",
    api_domain: API_DOMAIN,
    availability_query: availabilityQuery,
    config: {
        start_time: "08:00",
        end_time: "18:00",
        interval: 30,
        mode: "no_confirm"
    },
    styles: {
        prefix: "AV_team"
    }
};

const originalOptions = { ...availabilityOptions };

const teamRadiosWrapper = document.querySelector(".js--team-radios");

team[0].selected = true;

const toggleTeamAvailability = e => {
    const newSub = e.target.value;
    availabilityOptions.availability_query.participants[0].members = [
        buildUserParticipant(newSub)
    ];
    const updatedOptions = { ...availabilityOptions };
    Viewer.update(updatedOptions);
};

const teamRadios = team.map(teamMember => {
    const name = teamMember.name;
    const sub = teamMember.sub;
    const checked = teamMember.selected ? "checked" : "";
    const image = `<div class="multiselect__avatar" style="background-image:url('/assets/images/avatar_${
        teamMember.image_suffix
    }.jpg');"></div>`;
    return `
    <div class="check__wrapper check__wrapper--third check__wrapper--inline">
        <div class="check">
            <input type="radio" class="check__input js--team-selector" id="team-selector__${sub}" name="availability" value="${sub}" ${checked}>
            <label for="team-selector__${sub}" class="check__label--sym"></label>
        </div>
        <label for="team-selector__${sub}" class="check__label--visible">${image} ${name}</label>
    </div>
    `;
});
teamRadiosWrapper.innerHTML = teamRadios.join("");
const teamToggles = document.querySelectorAll(".js--team-selector");
[...teamToggles].map(teamToggle =>
    teamToggle.addEventListener("change", e => toggleTeamAvailability(e))
);

const Viewer = CronofyElements.AvailabilityViewer(originalOptions);

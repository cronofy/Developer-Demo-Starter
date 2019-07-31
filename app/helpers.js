const connections = require("./connections");

module.exports = {
    createTestCalendar: async (id, secret, apiDomain) =>
        await connections.createApplicationCalendar(apiDomain, {
            client_id: id,
            client_secret: secret,
            application_calendar_id: "testing_creds"
        }),

    buildTeamData: async (team, uuid, id, secret, apiDomain, timezone) =>
        await Promise.all(
            team.map(async (teamMember, i) => {
                const calID = `${uuid}_team_${pad(i + 1)}`;
                const calendarOptions = {
                    client_id: id,
                    client_secret: secret,
                    application_calendar_id: calID
                };
                const calendar = await connections.createApplicationCalendar(
                    apiDomain,
                    calendarOptions
                );

                const ruleOptions = {
                    availability_rule_id: "team_work_hours",
                    tzid: timezone,
                    weekly_periods: teamMember.rule
                };
                const rule = await connections.createRule(
                    apiDomain,
                    calendar.access_token,
                    ruleOptions
                );

                return {
                    id: calID,
                    image_suffix: teamMember.avatar,
                    name: teamMember.name,
                    job: teamMember.job,
                    selected: false,
                    sub: calendar.sub,
                    rule: rule.availability_rule_id
                };
            })
        )
};

function pad(number) {
    return number.toString().padStart(2, "0");
}

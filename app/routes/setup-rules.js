const helpers = require("../helpers");
const connections = require("../connections");
const periods = require("../rule-periods");

module.exports = (app, options) => {
    app.get("/setup-rules", async (req, res) => {
        const session = req.session;

        if (!session.sub) {
            // If there's no sub set, load the init page
            return res.redirect("/setup-start");
        }

        const token = await connections
            .getData(options.baseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    Authorization: `Bearer ${process.env.CLIENT_SECRET}`
                },
                body: JSON.stringify({
                    version: "1",
                    permissions: [
                        "agenda",
                        "availability",
                        "managed_availability",
                        "account_management"
                    ],
                    subs: [session.sub],
                    origin: options.url
                })
            })
            .catch(error => {
                console.warn(error);
                return { error: error };
            });

        if (token.error) {
            return res.redirect("/setup-auth");
        }

        const userInfo = await connections.getInfo(
            options.apiDomain,
            session.access_token
        );

        session.user = {
            name: userInfo.name,
            email: userInfo.email,
            profile: userInfo["cronofy.data"].profiles[0].profile_name
        };

        const rule = await connections.createRule(
            options.apiDomain,
            session.access_token,
            {
                availability_rule_id: "team_work_hours",
                tzid: session.timezone,
                weekly_periods: periods.lunchBreak([
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday"
                ])
            }
        );

        const teamMembers = [
            {
                name: "Afonso Amick",
                job: "Support Exec.",
                rule: periods.lunchBreak([
                    "monday",
                    "wednesday",
                    "thursday",
                    "friday"
                ]),
                avatar: "10"
            },
            {
                name: "Brian Blough",
                job: "Engineer",
                rule: periods.oddTimes,
                avatar: "02"
            },
            {
                name: "Carlyn Cogswell",
                job: "Senior Engineer",
                rule: periods.lunchBreak(["monday", "tuesday", "thursday"]),
                avatar: "08"
            },
            {
                name: "Daniele Domenick",
                job: "Engineer",
                rule: periods.afternoonsOnly([
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday"
                ]),
                avatar: "01"
            },
            {
                name: "Eryn Eccles",
                job: "Product Manager",
                rule: periods.morningsOnly([
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday"
                ]),
                avatar: "11"
            },
            {
                name: "Frederick Frankel",
                job: "Analyst",
                rule: periods.lunchBreak(["monday", "wednesday", "friday"]),
                avatar: "07"
            },
            {
                name: "Gwyn Gage",
                job: "",
                rule: periods.lunchBreak(["monday", "tuesday", "wednesday"]),
                avatar: "09"
            }
        ];

        const team = await helpers.buildTeamData(
            teamMembers,
            session.sub,
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            options.apiDomain,
            session.timezone
        );

        const user = {
            id: `${session.sub}_user`,
            image_suffix: "01",
            name: session.user.name,
            selected: false,
            sub: session.sub,
            rule: "team_work_hours"
        };
        session.team = [user, ...team];

        return res.render("pages/setup-rules", {
            token: token.element_token.token,
            api_domain: options.apiDomain,
            client_id: process.env.CLIENT_ID,
            timezone: session.timezone,
            url: options.url
        });
    });
};

const Cronofy = require("cronofy");
const moment = require("moment");
const connections = require("../connections");

module.exports = (app, options) => {
    app.get("/submit", async (req, res) => {
        const session = req.session;

        if (!req.query.slot) {
            return res.redirect("/");
        }

        console.log("session", session);

        if (!session.access_token) {
            return res.redirect("/");
        }

        const cronofyClient = new Cronofy({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            access_token: session.access_token
        });

        const slot = JSON.parse(req.query.slot);

        const userInfo = await connections.getInfo(
            options.apiDomain,
            session.access_token
        );

        const calendarId =
            userInfo["cronofy.data"].profiles[0].profile_calendars[0]
                .calendar_id;

        console.log("calendarId", calendarId);

        cronofyClient.createEvent({
            calendar_id: calendarId,
            event_id: "developer_demo_event",
            summary: "Demo meeting",
            description:
                "Developer demo has created this event to show that events can be added to a calendar.",
            start: slot.start,
            end: slot.end,
            location: {
                description: "Board room"
            }
        });

        const meetingDate = moment(slot.start).format("DD MMM YYYY");
        const start = moment(slot.start).format("LT");
        const end = moment(slot.end).format("LT");

        return res.render("pages/submit", {
            meetingDate,
            start,
            end
        });
    });
};

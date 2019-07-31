const moment = require("moment");

module.exports = (app, options) => {
    app.get("/email", async (req, res) => {
        const session = req.session;
        if (!session.sub) {
            // If there's no sub set, load the init page
            return res.redirect("/setup-start");
        }

        const timeNow = moment().format("DD MMM YYYY: HH:mm");

        if (req.query.type && req.query.type === "interview") {
            return res.render("pages/email-slots", {
                user: session.user,
                date: timeNow,
                query: req.query.query,
                subject: "Book your interview at Evenitron",
                from: "hiring@evenitron.com"
            });
        }

        const meetingtype =
            req.query.meetingtype === "1to1"
                ? "a 1:1 session"
                : req.query.meetingtype === "appraisal"
                ? "an appraisal "
                : req.query.meetingtype === "appraisal"
                ? "a team meeting "
                : "an interview ";

        if (req.query.type && req.query.type === "interview-confirm") {
            const slot = JSON.parse(req.query.slot);
            return res.render("pages/email-confirm", {
                user: session.user,
                date: timeNow,
                subject: "Your interview has been booked",
                from: "hiring@evenitron.com",
                name: req.query.name,
                title: req.query.title,
                location: req.query.location,
                meetingtype: meetingtype,
                meetingDate: moment(slot.start).format("DD MMM YYYY"),
                start: moment(slot.start).format("LT"),
                end: moment(slot.end).format("LT")
            });
        }

        if (req.query.type && req.query.type === "meeting-confirm") {
            const slot = JSON.parse(req.query.slot);

            return res.render("pages/email-confirm", {
                user: session.user,
                date: timeNow,
                subject: "A new meeting has been booked with you",
                from: "hr@evenitron.com",
                name: req.query.name,
                title: req.query.title,
                location: req.query.location,
                meetingtype: meetingtype,
                meetingDate: moment(slot.start).format("DD MMM YYYY"),
                start: moment(slot.start).format("LT"),
                end: moment(slot.end).format("LT")
            });
        }

        return res.redirect("/");
    });
};

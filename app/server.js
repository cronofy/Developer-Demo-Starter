// Import the dependencies
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");

// Enable dotenv
dotenv.config();

// Setup
const PORT = 7070;

// Setup Express
const app = express();
app.set("view engine", "ejs");
app.set("views", process.cwd() + "/app/templates");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/"));

const Cronofy = require("cronofy");
const cronofyClient = new Cronofy({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    data_center: process.env.DATA_CENTER,
    access_token: process.env.ACCESS_TOKEN,
});

// Route: home
app.get("/", async (req, res) => {
    const codeQuery = req.query.code;

    if (codeQuery) {
        const codeResponse = await cronofyClient
            .requestAccessToken({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: "authorization_code",
                code: codeQuery,
                redirect_uri: "http://localhost:7070/",
            })
            .catch((err) => {
                if (err.error === "invalid_grant") {
                    console.warn(
                        "\x1b[33m",
                        "\nWARNING:\nThere was a problem validating the `code` response. The provided code is not known, has been used, or was not paired with the provided redirect_uri.\n",
                        "\x1b[0m"
                    );
                } else {
                    console.warn(
                        "\x1b[33m",
                        "\nWARNING:\nThere was a problem validating the `code` response. Check that your CLIENT_ID, CLIENT_SECRET, and SUB environment variables are correct.\n",
                        "\x1b[0m"
                    );
                }
            });
    }

    const token = await cronofyClient
        .requestElementToken({
            version: "1",
            permissions: ["managed_availability", "account_management"],
            subs: [process.env.SUB],
            origin: "http://localhost:7070",
        })
        .catch(() => {
            console.error(
                "\x1b[31m",
                "\nERROR:\nThere was a problem generating the element token. Check that your CLIENT_ID, CLIENT_SECRET, and SUB environment variables are correct.\n",
                "\x1b[0m"
            );
            return { element_token: { token: "invalid" } };
        });

    return res.render("home", {
        element_token: token.element_token.token,
        client_id: process.env.CLIENT_ID,
        data_center: process.env.DATA_CENTER,
    });
});

// Route: availability
app.get("/availability", async (req, res) => {
    const token = await cronofyClient
        .requestElementToken({
            version: "1",
            permissions: ["availability"],
            subs: [process.env.SUB],
            origin: "http://localhost:7070",
        })
        .catch(() => {
            console.error(
                "\x1b[31m",
                "\nERROR:\nThere was a problem generating the element token. Check that your CLIENT_ID, CLIENT_SECRET, and SUB environment variables are correct.\n",
                "\x1b[0m"
            );
            return { element_token: { token: "invalid" } };
        });

    return res.render("availability", {
        element_token: token.element_token.token,
        data_center: process.env.DATA_CENTER,
        sub: process.env.SUB,
    });
});

// Route: submit
app.get("/submit", async (req, res) => {
    const slot = JSON.parse(req.query.slot);

    const userInfo = await cronofyClient.userInfo();

    const calendarId =
        userInfo["cronofy.data"].profiles[0].profile_calendars[0].calendar_id;

    cronofyClient.createEvent({
        calendar_id: calendarId,
        event_id: "developer_demo_event",
        summary: "Demo meeting",
        description:
            "Developer demo has created this event to show that events can be added to a calendar.",
        start: slot.start,
        end: slot.end,
        location: {
            description: "Board room",
        },
    });

    const meetingDate = moment(slot.start).format("DD MMM YYYY");
    const start = moment(slot.start).format("LT");
    const end = moment(slot.end).format("LT");

    return res.render("submit", {
        meetingDate: meetingDate,
        start: start,
        end: end,
    });
});

app.listen(PORT);
console.log("serving on http://localhost:7070");

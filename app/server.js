// Import the dependencies
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");

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

// Add the Cronofy client setup here

// Route: home
app.get("/", async (req, res) => {
    // Homepage code goes here

    return res.render("home", {
        token: "YOUR_TOKEN_GOES_HERE",
        client_id: process.env.CLIENT_ID,
    });
});

// Route: availability
app.get("/availability", async (req, res) => {
    // Availability code goes here

    return res.render("availability", {
        token: "YOUR_TOKEN_GOES_HERE",
        sub: process.env.SUB,
    });
});

// Route: submit
app.get("/submit", async (req, res) => {
    // Submit code goes here

    return res.render("submit", {
        meetingDate: "MEETING_DATE_GOES_HERE",
        start: "START_TIME_GOES_HERE",
        end: "END_TIME_GOES_HERE",
    });
});

app.listen(PORT);
console.log("serving on http://localhost:7070");

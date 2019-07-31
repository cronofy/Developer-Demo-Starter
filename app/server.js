const dotenv = require("dotenv");
const enforce = require("express-sslify");
dotenv.config();
const express = require("express");
const session = require("cookie-session");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 7070;
const URL = process.env.URL || `http://localhost:${PORT}`;
const API_DOMAIN = process.env.API_DOMAIN || "https://api.cronofy.com";
const baseUrl = `${API_DOMAIN}/v1/element_tokens`;

const app = express();

app.use(
    session({
        name: "demo_session",
        secret: "3wP8iRt7c9U5AJIz"
    })
);

if (process.env.MODE !== "development") {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/"));
app.set("view engine", "ejs");

app.set("views", process.cwd() + "/app/templates");

const options = {
    apiDomain: API_DOMAIN,
    baseUrl: baseUrl,
    url: URL
};

// Routes: wizard
require("./routes/setup-start")(app, options);
require("./routes/setup-auth")(app, options);
require("./routes/setup-rules")(app, options);

// Routes: normal
require("./routes/home")(app, options);
require("./routes/email")(app, options);
require("./routes/confirm")(app, options);

require("./routes/ats")(app, options);
require("./routes/meetings")(app);
require("./routes/schedule-meeting")(app, options);
require("./routes/settings")(app, options);
require("./routes/view-team")(app, options);

app.listen(PORT);
console.log(`serving on ${URL}`);

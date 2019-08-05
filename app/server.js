const dotenv = require("dotenv");
const enforce = require("express-sslify");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("cookie-session");

dotenv.config();

const PORT = process.env.PORT || 7070;
const URL = process.env.URL || `http://localhost:${PORT}`;

// Setup Express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/"));
app.set("view engine", "ejs");
app.set("views", process.cwd() + "/app/templates");
app.use(
    session({
        name: "developer_demo",
        secret: "9U5AJIasFaaadz"
    })
);
if (process.env.MODE !== "development") {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

const options = {
    apiDomain: process.env.API_DOMAIN,
    baseUrl: `${process.env.API_DOMAIN}/v1/element_tokens`,
    url: URL
};

// Routes
require("./routes/home")(app, options);
require("./routes/availability")(app, options);
require("./routes/submit")(app, options);

app.listen(PORT);
console.log(`serving on ${URL}`);

const dotenv = require("dotenv");
const enforce = require("express-sslify");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 7070;
const URL = process.env.URL || `http://localhost:${PORT}`;
const API_DOMAIN = process.env.API_DOMAIN || "https://api.cronofy.com";
const baseUrl = `${API_DOMAIN}/v1/element_tokens`;

const app = express();

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

// Routes
require("./routes/home")(app, options);
require("./routes/share")(app, options);

app.listen(PORT);
console.log(`serving on ${URL}`);

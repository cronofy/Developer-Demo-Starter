const Cronofy = require("cronofy");

module.exports = (app, options) => {
    app.get("/share", async (req, res) => {
        const cronofyClient = new Cronofy({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        const token = await cronofyClient.requestElementToken({
            version: "1",
            permissions: ["availability"],
            subs: [process.env.SUB],
            origin: options.url
        });

        return res.render("pages/availability", {
            token: token.element_token.token,
            api_domain: options.apiDomain,
            sub: process.env.SUB
        });
    });
};

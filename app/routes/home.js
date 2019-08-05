const Cronofy = require("cronofy");

module.exports = (app, options) => {
    app.get("/", async (req, res) => {
        const session = req.session;

        const cronofyClient = new Cronofy({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        const codeQuery = req.query.code;

        if (codeQuery) {
            const codeResponse = await cronofyClient.requestAccessToken({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: "authorization_code",
                code: codeQuery,
                redirect_uri: `${options.url}/`
            });
            session.access_token = codeResponse.access_token;
        }

        const token = await cronofyClient.requestElementToken({
            version: "1",
            permissions: ["managed_availability", "account_management"],
            subs: [process.env.SUB],
            origin: options.url
        });

        return res.render("pages/settings", {
            token: token.element_token.token,
            api_domain: options.apiDomain,
            error: false,
            url: options.url,
            client_id: process.env.CLIENT_ID
        });
    });
};

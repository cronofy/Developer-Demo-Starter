const connections = require("../connections");

module.exports = (app, options) => {
    app.get("/setup-auth", async (req, res) => {
        const session = req.session;

        const codeQuery = req.query.code;

        if (codeQuery) {
            const codeResponse = await connections.getData(
                `${options.apiDomain}/oauth/token`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        grant_type: "authorization_code",
                        code: codeQuery,
                        redirect_uri: `${options.url}/setup-auth/`
                    })
                }
            );
            session.sub = codeResponse.sub;
            session.access_token = codeResponse.access_token;
            return res.redirect("/setup-rules");
        }

        return res.render("pages/setup-auth", {
            token: false,
            api_domain: options.apiDomain,
            client_id: process.env.CLIENT_ID,
            url: options.url
        });
    });
};

const helpers = require("../helpers");
const connections = require("../connections");

module.exports = (app, options) => {
    app.get("/confirm", async (req, res) => {
        const session = req.session;
        if (!session.sub) {
            // If there's no sub set, load the init page
            return res.redirect("/setup-start");
        }

        const query = req.query.query ? req.query.query : false;
        const subs = req.query.query
            ? JSON.parse(req.query.query).participants[0].members.map(
                  member => member.sub
              )
            : false;

        const token = await connections
            .getData(options.baseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    Authorization: `Bearer ${process.env.CLIENT_SECRET}`
                },
                body: JSON.stringify({
                    version: "1",
                    permissions: ["availability"],
                    subs: subs,
                    origin: options.url
                })
            })
            .catch(error => {
                console.warn(error);
                return { error: error };
            });

        if (token.error) {
            return res.redirect("/setup-auth");
        }
        return res.render("pages/confirm", {
            token: token.element_token.token,
            api_domain: options.apiDomain,
            query
        });
    });
};

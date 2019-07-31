const helpers = require("../helpers");
const connections = require("../connections");

module.exports = (app, options) => {
    app.get("/ats", async (req, res) => {
        const session = req.session;
        if (!session.sub) {
            // If there's no sub set, load the init page
            return res.redirect("/setup-start");
        }

        const teamSubs = session.team.map(teamMember => teamMember.sub);

        const token = await connections
            .getData(options.baseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    Authorization: `Bearer ${process.env.CLIENT_SECRET}`
                },
                body: JSON.stringify({
                    version: "1",
                    permissions: [
                        "agenda",
                        "availability",
                        "managed_availability",
                        "account_management"
                    ],
                    subs: [session.sub, ...teamSubs],
                    origin: options.url
                })
            })
            .catch(error => {
                console.warn(error);
                return { error: error };
            });

        return res.render("pages/ats", {
            token: token.element_token.token,
            api_domain: options.apiDomain,
            sub: session.sub,
            team: session.team
        });
    });
};

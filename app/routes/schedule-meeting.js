const helpers = require("../helpers");
const connections = require("../connections");

module.exports = (app, options) => {
    app.get("/meetings/schedule", async (req, res) => {
        const session = req.session;
        if (!session.sub) {
            // If there's no sub set, load the init page
            return res.redirect("/setup-start");
        }

        const name = req.query.n || "01";
        const role = req.query.jt || "Engineer";
        const avatar = req.query.av || "Tokynaga Yae";

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
                    permissions: ["availability"],
                    subs: [session.sub, ...teamSubs],
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
        return res.render("pages/person", {
            token: token.element_token.token,
            api_domain: options.apiDomain,
            sub: session.sub,
            error: false,
            name: name,
            avatar: avatar,
            team: session.team,
            role: role
        });
    });
};

const connections = require("../connections");

module.exports = (app, options) => {
    app.get("/share", async (req, res) => {
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
                    subs: [process.env.SUB],
                    origin: options.url
                })
            })
            .catch(error => {
                console.warn(error);
                return { error: error };
            });

        return res.render("pages/share", {
            token: token.element_token.token,
            api_domain: options.apiDomain,
            sub: process.env.SUB
        });
    });
};

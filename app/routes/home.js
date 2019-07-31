const helpers = require("../helpers");

module.exports = (app, options) => {
    app.get("/", async (req, res) => {
        const session = req.session;
        if (!session.sub) {
            // If there's no sub set, load the init page
            return res.redirect("/setup-start");
        }

        const finished = req.query.finished || false;

        return res.render("pages/index", { wizardComplete: finished });
    });
};

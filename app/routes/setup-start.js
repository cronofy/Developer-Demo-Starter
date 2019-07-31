module.exports = (app, options) => {
    app.get("/setup-start", async (req, res) => {
        // Clear any existing sessions (we want a clean
        // slate before starting the wizard)
        req.session = null;

        return res.render("pages/setup-start");
    });

    app.post("/setup-start", async (req, res) => {
        console.log("posting to setup-start");

        const session = req.session;
        session.timezone = req.body.timezone || "Etc/UTC";

        return res.redirect("/setup-auth");
    });
};

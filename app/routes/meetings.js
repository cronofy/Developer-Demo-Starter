module.exports = app => {
    app.get("/meetings", async (req, res) => {
        const session = req.session;
        if (!session.sub) {
            // If there's no sub set, load the init page
            return res.redirect("/setup-start");
        }
        return res.render("pages/people", { team: session.team });
    });
};

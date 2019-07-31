const fetch = require("node-fetch");

module.exports = {
    inConnections: message => console.log(message),

    getData: async (url, options) =>
        await fetch(url, options)
            .then(async res => await res.json())
            .catch(err => {
                console.log(err);
                return err;
            }),

    createApplicationCalendar: async (apiDomain, options) =>
        await fetch(`${apiDomain}/v1/application_calendars/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(options)
        })
            .then(async res => await res.json())
            .catch(err => {
                console.log(err);
                return err;
            }),

    createRule: async (apiDomain, token, options) =>
        await fetch(`${apiDomain}/v1/availability_rules/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(options)
        })
            .then(async res => await res.json())
            .catch(err => {
                console.log(err);
                return err;
            }),

    getInfo: async (apiDomain, token) =>
        await fetch(`${apiDomain}/v1/userinfo/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(async res => await res.json())
            .catch(err => {
                console.log(err);
                return err;
            })
};

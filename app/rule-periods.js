const buildPerid = (day, start, end) => ({
    day: day,
    start_time: start,
    end_time: end
});

module.exports = {
    nineToFive: [
        buildPerid("monday", "09:00", "17:00"),
        buildPerid("tuesday", "09:00", "17:00"),
        buildPerid("wednesday", "09:00", "17:00"),
        buildPerid("thursday", "09:00", "17:00"),
        buildPerid("friday", "09:00", "17:00")
    ],

    certainDays: days => days.map(day => buildPerid(day, "09:00", "17:00")),

    afternoonsOnly: days => days.map(day => buildPerid(day, "14:00", "17:00")),

    morningsOnly: days => days.map(day => buildPerid(day, "09:00", "13:00")),

    lunchBreak: days =>
        days
            .map(day => [
                buildPerid(day, "09:00", "13:00"),
                buildPerid(day, "14:00", "17:00")
            ])
            .reduce((acc, val) => acc.concat(val), []),

    oddTimes: [
        buildPerid("monday", "09:00", "13:00"),
        buildPerid("monday", "14:00", "17:00"),
        buildPerid("tuesday", "10:00", "11:00"),
        buildPerid("tuesday", "12:00", "14:00"),
        buildPerid("tuesday", "16:00", "17:00"),
        buildPerid("thursday", "09:00", "10:30"),
        buildPerid("thursday", "14:00", "16:00"),
        buildPerid("friday", "09:00", "12:00")
    ]
};

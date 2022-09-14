const Event = require('../models/Event.model');

exports.getEvents = (async (req, res, next) => {

    const events = await Event.find();

    return res.send(events)
})

exports.getEventsByType = (async (req, res, next) => {
    const { type } = req.query;

    const events = await Event.find({ type: type });

    return res.send(events)
})

exports.getEventsById = (async (req, res, next) => {

    const event = await Event.findById(req.params.id);

    return res.send(event)
})

exports.postEvent = (async (req, res, next) => {

    let eventsRecord = await Event.find();

    console.log(eventsRecord);

    for (var i = 0; i < eventsRecord.length; i++) {
        console.log("check", eventsRecord[i].date)
        if (eventsRecord[i].date === req.body.date) {
            return res.send("Slot already booked")
        } else {
            let event = new Event({
                type: req.body.type,
                title: req.body.title,
                venue: req.body.venue,
                date: req.body.date,
                description: req.body.description,
                image: req.body.image,
                hostedBy: req.decoded.id
            })

            event.save((err) => {

                if (err) {
                    console.log(err)
                }

                return res.send("Event posted successfully")
            })
        }
    }
});

exports.interestedEvent = ((req, res, next) => {
    Event.findByIdAndUpdate(req.body.id, {
        $push: {
            interested: req.decoded.id
        }
    }, {
        new: true
    }, (err, event) => {
        if (err) return next(err)

        res.send(event)
    })
});

exports.notInterestedEvent = ((req, res, next) => {
    Event.findByIdAndUpdate(req.body.id, {
        $pull: {
            interested: req.decoded.id
        }
    }, {
        new: true
    }, (err, event) => {
        if (err) return next(err)
        res.send(event)
    })
});
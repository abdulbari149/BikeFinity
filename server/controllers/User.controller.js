const sendMessage = require('../helpers/Twilio');
const Ads = require('../models/Ads.model');
const User = require('../models/User.model');
const Review = require('../models/Review.model');
const Event = require('../models/Event.model');

exports.postAd = ((req, res, next) => {
    let ad = new Ads({
        title: req.body.title,
        price: req.body.price,
        year: req.body.year,
        make: req.body.make,
        model: req.body.model,
        engine: req.body.engine,
        kilometers: req.body.kilometers,
        condition: req.body.condition,
        description: req.body.description,
        location: req.body.location,
        image: req.body.image,
        postedBy: req.decoded.id
    });

    ad.save((err) => {
        if (err) return next(err);

        res.send("Ad posted successfully");
    })
});

exports.getAds = ((req, res, next) => {

    const page = req.query.page
    const adsPerPage = 10;

    Ads.aggregate([
        {
            $match: {
                status: "Active"
            }
        },
        {
            $skip: (page - 1) * adsPerPage
        },
        {
            $limit: adsPerPage
        }
    ], (err, ads) => {
        if (err) return next(err);

        res.send(ads);
    });
});

exports.getAd = ((req, res, next) => {
    Ads.findById(req.params.id).populate('postedBy')
        .then((ad) => {
            res.send(ad)
        })
        .catch((err) => {
            next(err)
        })
});

exports.likeAd = ((req, res, next) => {
    Ads.findByIdAndUpdate(req.body.id, {
        $push: {
            likedBy: req.decoded.id
        }
    }, {
        new: true
    }, (err, ad) => {
        if (err) return next(err)

        res.send(ad)
    })
});

exports.unlikeAd = ((req, res, next) => {
    // console.log(req.params.id)
    Ads.findByIdAndUpdate(req.body.id, {
        $pull: {
            likedBy: req.decoded.id
        }
    }, {
        new: true
    }, (err, ad) => {
        if (err) return next(err)
        res.send(ad)
    })
});

exports.search = (async (req, res, next) => {
    var regex = new RegExp(req.body.title, 'i');

    Ads.find({ title: regex }, (err, ads) => {
        if (err) return next(err)

        return res.send(ads)
    })
})

//update profile
exports.updateProfile = ((req, res, next) => {
    User.findByIdAndUpdate(req.decoded.id, {
        name: req.body.name,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        location: req.body.location
    }, {
        new: true
    }, (err, user) => {
        if (err) return next(err)
        res.send(user)
    })
});

exports.stats = (async (req, res, next) => {

    let reviewCount = await Review.find({ userId: req.decoded.id });

    let adsCount = await Ads.find({ postedBy: req.decoded.id });

    let eventsCount = await Event.find({ hostedBy: req.decoded.id });

    let interestedEventsCount = await Event.find({
        interested: {
            $in: [req.decoded.id]
        }
    })

    let likedAdsCount = await Ads.find({
        likedBy: {
            $in: [req.decoded.id]
        }
    })


    res.send({
        reviewCount: reviewCount.length,
        adsCount: adsCount.length,
        eventsCount: eventsCount.length,
        interestedEventsCount: interestedEventsCount.length,
        likedAdsCount: likedAdsCount.length
    })

});

//messaging using TWILIO
exports.message = (async (req, res, next) => {
    try {
        let messageId = await sendMessage(req.body.message, req.body.to);
        if (messageId) {
            return res.send(messageId);
        }
    } catch (e) {
        return res.send(e);
    }
})
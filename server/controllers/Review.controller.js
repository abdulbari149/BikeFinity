const Review = require('../models/Review.model');
const Bike = require('../models/Bike.model');
const mongoose = require('mongoose');

exports.postReview = (async (req, res, next) => {

    let review = new Review({
        review: req.body.review,
        rating: req.body.rating,
        bikeId: req.body.bikeId,
        userId: req.decoded.id,
    });

    let bike = await Bike.findById(review.bikeId);

    let counterReviews = bike.counterReviews + 1;

    let averageRating = 0;

    if (bike.averageRating > 0) {
        averageRating = (bike.averageRating + review.rating) / 2;
    } else {
        averageRating = review.rating;
    }

    Bike.findByIdAndUpdate(review.bikeId,
        {
            $set: {
                averageRating: averageRating,
                counterReviews: counterReviews
            }
        }, (err) => {
            if (err) return next(err);
        });

    review.save((err) => {
        if (err) return next(err);

        res.send("Review posted successfully");
    });
});

exports.updateReview = (async (req, res, next) => {

    let review = await Review.findById(req.params.id);

    let bike = await Bike.findById(review.bikeId);

    let averageRating = 0;

    if (review.rating != req.body.rating) {
        if (bike.counterReviews === 1) {
            averageRating = req.body.rating;
        } else {
            averageRating = (bike.averageRating * 2) - review.rating;
            averageRating = (averageRating + req.body.rating) / 2;
        }
    }

    Bike.findByIdAndUpdate(review.bikeId, {
        $set: {
            averageRating: averageRating
        }
    }, (err) => {
        if (err) return next(err);
    });

    Review.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (err) => {
        if (err) return next(err);

        res.send({
            status: 200,
            msg: "Review updated successfully"
        });
    });
});

exports.deleteReview = (async (req, res, next) => {

    let review = await Review.findById(req.params.id);

    let bike = await Bike.findById(review.bikeId);

    let counterReviews = 0, averageRating = 0;

    if (bike.counterReviews === 1) {
        counterReviews = 0;
        averageRating = 0;
    } else {
        counterReviews = bike.counterReviews - 1;
        averageRating = (bike.averageRating * 2) - review.rating;
    }

    Bike.findByIdAndUpdate(review.bikeId,
        {
            $set: {
                averageRating: averageRating,
                counterReviews: counterReviews
            }
        }, (err) => {
            if (err) return next(err);
        });

    Review.findByIdAndDelete(req.params.id, (err) => {
        if (err) return next(err);

        res.send({
            status: 200,
            msg: "Review deleted successfully"
        });
    });

})

exports.getReviews = ((req, res, next) => {

    const page = req.query.page;
    const adsPerPage = 10;

    Review.aggregate([
        {
            $match: {
                bikeId: mongoose.Types.ObjectId(req.params.id)
            }
        },
        {
            $skip: (page - 1) * adsPerPage
        },
        {
            $limit: adsPerPage
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
    ], (err, review) => {
        if (err) return next(err);

        res.send(review);
    })
});

exports.getTopRatedReviews = ((req, res, next) => {
    Review.find({}, (err, reviews) => {
        if (err) return next(err);

        res.send(reviews);
    })
});

//getting user review with respect to one specific bike for checking that if user gives one review than there is no chance to give second review.
exports.getUserReview = ((req, res, next) => {
    Review.find({ bikeId: req.params.id, userId: req.decoded.id }, (err, review) => {
        if (err) return next(err);

        if (review.length === 0) {
            res.send({
                status: 404,
                msg: "No Review Found"
            })
        }
        else {
            res.send(review[0])
        }
    })
});
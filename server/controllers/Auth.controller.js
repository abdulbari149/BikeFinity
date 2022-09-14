const User = require('../models/User.model');
const config = require('../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const OtpGenerator = require('../helpers/OtpGenerator')

exports.UserLogin = ((req, res, next) => {
    let expiration = '7d'; //expires in seven days

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return next(err);
        if (!user) return res.send({
            status: 404,
            msg: 'User not found'
        }); //res.status(404).send("User not found"); how to check status code from frontend

        var passwordValidity = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordValidity) return res.send({
            auth: false,
            token: null,
            status: 401,
            msg: 'Unauthorized'
        }); //res.status(401).send({ auth: false, token: null })

        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: expiration
        });

        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            req.decoded = decoded;
        });

        User.findById(req.decoded.id, (err, user) => {
            if (err) return next(err)

            res.status(200).send({ auth: true, token: token, expiry: req.decoded.exp, userId: req.decoded.id, user: user });
        })
    });
});

exports.UserSignup = ((req, res, next) => {
    let user = new User({
        password: bcrypt.hashSync(req.body.password, 8),
        name: req.body.name,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        location: req.body.location,
        profilePicture: req.body.profilePicture,
    });

    user.save((err) => {
        if (err) return next(err);

        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'cs1812102@szabist.pk',
                pass: 'szabistsucks'
            }
        });

        let mailDetails = {
            from: 'info@bikefinity.pk <noreply@bikefinity.pk>',
            to: user.email,
            subject: 'Welcome to BikeFinity',
            text: `Hi ${user.name},\n\nWelcome to Bikefinity and thankyou for signing up with us. From now on you will get regular updates on biking events in your desired city and since you are now a premium member of Bikefinity, you can advertise the sell of your bike at no cost or browse thousands of bike for your daily or predilection bike.\n\nKeep an eye on reviews tab as we'll be sending you the best bike for your desired budget. Let's get you a healthy and bubbly experience.\n\nCheers,\nBikeFinity`
        };

        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log('Error Occurs');
            } else {
                res.send("User registered successfully");
            }
        });
    })
});

exports.checkUser = ((req, res, next) => {
    User.findOne({
        email: req.params.email
    }, (err, user) => {
        if (err) return next(err);

        if (user) {
            res.send({
                message: 'User already exists',
                status: true
            })
        }
        else {
            res.send({
                message: 'User does not exists',
                status: false
            })
        }
    })
});

exports.resetPassword = (async (req, res, next) => {
    if (!req.body.email) {
        return res.status(400).send({
            statusCode: 0,
            message: "Email is required."
        })
    }

    let user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(200).send({
            statusCode: 0,
            message: 'User not found'
        });
    }

    let resetCode = await OtpGenerator.generateOTP();
    let resetCodeExpiry = new Date(Date.now() + 1 * (60 * 60 * 1000));

    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'cs1812102@szabist.pk',
            pass: 'szabistsucks'
        }
    });

    var mailOptions = {
        from: 'info@bikefinity.pk <noreply@bikefinity.pk>',
        to: user.email,
        subject: 'Password Reset Code',
        text: `Hi ${user.name}. Your Password reset code is : ${resetCode}`
    };

    mailTransporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    User.findByIdAndUpdate(user._id,
        {
            $set: {
                resetCode: resetCode,
                resetCodeExpiry: resetCodeExpiry
            }
        },
        {
            new: true
        },
        (err, user) => {
            if (err) return err;

            return res.status(200).send({
                statusCode: 1,
                message: "Successfully generated OTP",
                data: {
                    user: user
                }
            })
        })
});


exports.verifyOTP = (async (req, res, next) => {

    if (!req.body.email || !req.body.resetCode) {
        return res.status(400).send({
            statusCode: 0,
            message: "All fields are required."
        })
    }

    let user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).send({
            statusCode: 0,
            message: 'User not found'
        });
    }

    let now = new Date();

    if (now < user.resetCodeExpiry) {
        if (req.body.resetCode === user.resetCode) {
            return res.status(200).send({
                statusCode: 1,
                message: "Reset code verified."
            })
        } else {
            return res.status(200).send({
                statusCode: 0,
                message: "Invalid reset code."
            })
        }
    } else {
        return res.status(200).send({
            statusCode: 0,
            message: "Reset code expired."
        })
    }
});

exports.updatePassword = (async (req, res, next) => {

    if (!req.body.password) {
        return res.status(400).send({
            statusCode: 0,
            message: "Password is required."
        })
    }

    let user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).send({
            statusCode: 0,
            message: 'User not found.'
        });
    }

    let passwordValidity = bcrypt.compareSync(req.body.password, user.password);

    if (passwordValidity) {
        return res.status(200).send({
            statusCode: 0,
            message: "Password must be new."
        })
    } else {

        let password = bcrypt.hashSync(req.body.password, 8)

        User.findByIdAndUpdate(user._id,
            {
                $set: {
                    password: password,
                    resetCode: null,
                    resetCodeExpiry: null
                }
            },
            {
                new: true
            },
            (err, user) => {
                if (err) return err;

                return res.status(200).send({
                    statusCode: 1,
                    message: "Password reset successfully",
                    data: {
                        user: user
                    }
                })
            })
    }
});
const express = require('express')
const router = express.Router();
const catchAsync = require('.././utilis/catchAsync');
const ExpressError = require('.././utilis/ExpressError');

module.exports.sendEmail= catchAsync(async (req, res, next) => {
    const emailVerificationLink=`http://localhost:3000/verifyEmail/${req.alertId}&${req.contact_id}`;
})
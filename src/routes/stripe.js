const express = require("express");
const StripeController = require("../controllers/stripe.js")


const router = express.Router();

router.post("/session", StripeController.session);

router.post("/billing-session", StripeController.billingSession);

router.get("/is-subscribed", StripeController.isSubscribed);


module.exports = router;
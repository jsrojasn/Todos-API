const User = require("../models/user");
const stripe = require("../utils/stripe");

exports.session = async (req, res, next) => {
  try {
    const userData = req.userData;
    const userStripeCustomerId = userData.stripeCustomerId;

    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: process.env.SUBSCRIPTION_ID,
            quantity: 1,
          },
        ],
        success_url: "http://localhost:3000/",
        cancel_url: "http://localhost:3000/",
        customer: userStripeCustomerId,
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      }
    );

    return res.json(session);
  } catch (error) {
    return res.status(500).json({
      error: "Error creating session",
    });
  }
};

exports.billingSession = async (req, res, next) => {
  try {
    const userData = req.userData;
    const userStripeCustomerId = userData.stripeCustomerId;

    const session = await stripe.billingPortal.sessions.create(
      {
        customer: userStripeCustomerId,
        return_url: "http://localhost:3000/article-plans",
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      }
    );

    return res.json(session);
  } catch (error) {
    return res.status(500).json({
      error: "Error creating session",
    });
  }
};

exports.isSubscribed = async (req, res, next) => {
  try {
    const userData = req.userData;

    const subscriptions = await stripe.subscriptions.list(
      {
        customer: userData.stripeCustomerId,
        status: "active",
        expand: ["data.default_payment_method"],
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      }
    );

    return res.status(200).json({
      isSub: subscriptions.data.length > 0,
    });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred",
    });
  }
};

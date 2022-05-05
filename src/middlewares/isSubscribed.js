const stripe = require("../utils/stripe");

module.exports = async (req, res, next) => {
  const userData = req.userData;

  const subscriptions = await stripe.subscriptions.list(
    {
      customer: userData.stripeCustomerId,
      status: "active",
      expand: ["data.default_payment_method"],
    },
    {
      apiKey:
        process.env.STRIPE_SECRET_KEY,
    }
  );

  if (!subscriptions.data.length)
    return res.status(403).json({
      message: "Unauthorized Request",
    });

  return next();
};

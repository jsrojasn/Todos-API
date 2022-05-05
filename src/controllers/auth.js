const jwt = require("jsonwebtoken");

const User = require("../models/user");
const stripe = require("../utils/stripe");

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user)
      return res.status(200).json({
        message: "Email already used",
      });

    const customer = await stripe.customers.create(
      {
        email,
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      }
    );

    const newUser = new User({
      email,
      password,
      stripeCustomerId: customer.id,
    });

    const savedUser = await newUser.save();
    const token = jwt.sign(
      {
        email: savedUser.email,
        stripeCustomerId: customer.id,
        userId: savedUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    return res.status(200).json({
      message: "Signup successful",
      token: token,
      userEmail: savedUser.email,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "User doesnt exist",
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) throw new Error("Invalid password");

    const token = jwt.sign(
      {
        email: user.email,
        stripeCustomerId: user.stripeCustomerId,
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    return res.status(200).json({
      message: "Signin successful",
      token: token,
      userEmail: user.email,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Invalid email or password",
    });
  }
};

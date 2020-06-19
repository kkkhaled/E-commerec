/*const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async (req, res) => {
  const { amount } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "E-commerce app",
    });
  
    console.log(payment);
    res.status(200).send(paymentIntent.client_secret);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};

/*module.exports = (app) => {
  app.post("/stripe/checkout", (req, res) => {
    stripe.customers
      .create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
      })
      .then((customer) =>
        stripe.charges
          .create({
            amount: req.body.amount,
            description: "Web Development Ebook",
            currency: "usd",
            description: "Ecoomerce app",
            customer: customer.id,
          })
          .then((err) => {
            console.log(err);
          })
      );
  });
};*/

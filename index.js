import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import { client } from "./db/index.js";
import morgan from "morgan";
import apiRouter from "./api/index.js";
import StripePackage from "stripe";
const server = express();
const Stripe = new StripePackage(
  "sk_test_51MvOTQLhGAqNc30vEsExUrFXzbDpsKHcOIGxxIAmuYLf6DD3gYXMqyFzC9MEJz9aJ8cnUayMiK3MGbUtb4y5qBcP00OkK8mCMx"
);
const PORT = process.env.PORT || 3001;

morgan.token("body", (req) => JSON.stringify(req.body));
const customMorganFormat =
  ":method :url HTTP/:http-version :status :res[content-length] - :response-time ms :body";

client.connect();

server.use(morgan(customMorganFormat));

// app.use(bodyParser.json());

server.use(cors());

server.use(express.json());

server.use("/api", apiRouter);

// const calculateOrderAmount = (items) => {
//   // Replace this constant with a calculation of the order's amount
//   // Calculate the order total on the server to prevent
//   // people from directly manipulating the amount on the client
//   return 1400;
// };

// server.post("/create-payment-intent", async (req, res) => {
//   const { items } = req.body;

//   // Create a PaymentIntent with the order amount and currency
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: calculateOrderAmount(items),
//     currency: "usd",
//     automatic_payment_methods: {
//       enabled: true,
//     },
//   });

//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// });

// 404 handler
server.get("*", (req, res) => {
  res.status(404).send({
    name: "404 - Not Found",
    message: "No route found for the requested URL",
  });
});

// error handling middleware
server.use((error, req, res, next) => {
  console.error("SERVER ERROR: ", error);
  if (res.statusCode < 400) res.status(500);
  res.send({ name: error.name, message: error.message });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("The server is up on port", PORT);
});

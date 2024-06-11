const mongoose = require("mongoose");

const Apartment = mongoose.model(
  "Apartment",
  new mongoose.Schema({
    price: String,
    description: String,
    size: String,
    address: String,
    city: String,
    country: String,
  })
);

module.exports = Apartment;
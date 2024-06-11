const Apartment = require("../models/apartment.model");

exports.getAllApartments = (req, res) => {
  Apartment.find()
    .populate()
    .then((apartments) => res.status(200).send(apartments))
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.listApartment = (req, res) => {
  const { price, size, description, address, city, country } = req.body;

  const apartment = new Apartment({
    price,
    size,
    description,
    address,
    city,
    country,
  });

  apartment
    .save()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.deleteApartment = (req, res) => {
    Apartment.findByIdAndDelete(req.params.id).then((result) => {
      if (!result) {
        return res.status(404).send({ message: "Apartment not found" });
      }
      res.send({ message: "Apartment was deleted successfully!" });
    })
    .catch(() => {
      res.status(500).send({ message: "Could not delete Apartment" });
    });
  };

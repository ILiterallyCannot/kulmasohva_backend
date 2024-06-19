import ApartmentModel from "../models/apartment.model";
import { Request as Req, Response as Res } from 'express';

export const getAllApartments = async (req: Req, res: Res): Promise<void> => {
  try {
    const apartments = await ApartmentModel.find();
    res.status(200).send(apartments);
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};

export const listApartment = async (req: Req, res: Res): Promise<void> => {
  const { price, size, description, address, city, country } = req.body;

  const apartment = new ApartmentModel({
    price,
    size,
    description,
    address,
    city,
    country,
  });

  try {
    const data = await apartment.save();
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};

export const deleteApartment = async (req: Req, res: Res): Promise<void> => {
  try {
    const result = await ApartmentModel.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).send({ message: "Apartment not found" });
      return;
    }
    res.send({ message: "Apartment was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: "Could not delete Apartment" });
  }
};

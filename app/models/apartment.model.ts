import { Document, model, Schema } from 'mongoose';

export interface IApartment extends Document {
  price: number;
  size: number;
  description: string;
  address: string;
  city: string;
  country: string;
}

const apartmentSchema = new Schema<IApartment>({
  price: { type: Number, required: true },
  size: { type: Number, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
});

const ApartmentModel = model<IApartment>('Apartment', apartmentSchema);

export default ApartmentModel;
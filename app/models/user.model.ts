import mongoose, { Document, model, Types, Schema} from "mongoose";

export interface IUser extends Document {
  username: String;
  email: String;
  password: String;
  name?: String;
  surname?: String;
  phonenumber?: String;
  city?: String;
  country?: String;
  roles: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String},
  surname: { type: String},
  phonenumber: { type: String},
  city: { type: String},
  country: { type: String},
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
}, { timestamps: true });

const UserModel = model<IUser>("User", userSchema);

export default UserModel;

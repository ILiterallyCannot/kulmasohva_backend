import mongoose, { Document, model, Schema, Types } from 'mongoose';

export interface IRole extends Document {
  _id: Types.ObjectId,
  name: string
}

const roleSchema = new Schema<IRole>({
  name: { type: String, required: true },
}, {
  timestamps: true
});

const RoleModel = model<IRole>('Role', roleSchema);

export default RoleModel;
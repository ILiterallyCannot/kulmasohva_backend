import mongoose, { Document, model, Schema, Types } from 'mongoose';

export interface IPost extends Document {
  title: string,
  content: string
  date: Date,
  userId: Types.ObjectId[],
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  userId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
}]
}, {
  timestamps: true
});

const PostModel = model<IPost>('Post', postSchema);

export default PostModel;

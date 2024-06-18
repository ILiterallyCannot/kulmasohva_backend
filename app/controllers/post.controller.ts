import PostModel from "../models/post.model";
import { Req, Res } from "express";

export const createPost = async (req: Req, res: Res): Promise<void> => {
  try {
    const { title, content, date, userId } = req.body;

    const post = new PostModel({
      title,
      content,
      date,
      userId,
    });

    const savedPost = await post.save();
    res.status(200).send({ message: "Post successful!", savedPost });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: (err as Error).message });
  }
};

export const getAllPosts = async (req: Req, res: Res): Promise<void> => {
  try {
    const posts = await PostModel.find();
    res.status(200).send(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: (err as Error).message });
  }
};

export const getPostsByUser = async (req: Req, res: Res): Promise<void> => {
  try {
    const posts = await PostModel.find({ userId: req.params.userId });
    res.status(200).send(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: (err as Error).message });
  }
};

export const deletePost = async (req: Req, res: Res): Promise<void> => {
  try {
    const result = await PostModel.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).send({ message: "Post not found!" });
    }
    res.send({ message: "Post was deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Unable to delete post!" });
  }
};

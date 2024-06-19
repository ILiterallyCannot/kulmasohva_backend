import mongoose from "mongoose";
import UserModel from "./user.model";
import RoleModel from "./role.model";
import ApartmentModel from "./apartment.model";
import PostModel from "./post.model";

mongoose.Promise = global.Promise;

const db = {
    mongoose: mongoose,
};

export const models = {
    user: UserModel,
    role: RoleModel,
    ROLES: ["user", "admin", "moderator"],
    apartment: ApartmentModel,
    post: PostModel,
}

export default db;
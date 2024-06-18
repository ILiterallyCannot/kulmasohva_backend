import mongoose from "mongoose";
import UserModel from "./user.model";
import RoleModel from "./role.model";

mongoose.Promise = global.Promise;

const db = {
    mongoose: mongoose,
    user: UserModel,
    role: RoleModel,
    ROLES: ["user", "admin", "moderator"],
};

export default db;

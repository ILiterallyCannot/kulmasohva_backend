import { Request as Req, Response as Res, NextFunction as Next } from "express";
import express from 'express';
import AuthRouter from "./app/routes/auth.routes";
import UserRouter from "./app/routes/user.routes";
import PostRouter from "./app/routes/post.routes";
import RoleRouter from "./app/routes/role.routes";
import ApartmentRouter from "./app/routes/apartment.routes";
import {dbConfig} from "./app/config/db.config"
import UserModel from "./app/models/user.model";
import RoleModel from "./app/models/role.model";
import db from "./app/models"
const cors = require('cors'); 

const app = express();

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
    //updateUsers();
  })
  .catch((err: Error) => {
    console.error("Connection error", err);
    process.exit(1);
  });

db.mongoose.connection.on("error", (err: Error) => {
  console.error("MongoDB connection error:", err);
});

db.mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB connection lost. Attempting to reconnect...");
  db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`);
});

async function updateUsers() {
  try {
    await UserModel.updateMany(
      {
        name: { $exists: false },
        surname: { $exists: false },
        phonenumber: { $exists: false },
        city: { $exists: false },
        country: { $exists: false },
      },
      {
        $set: {
          name: "",
          surname: "",
          phonenumber: "",
          city: "",
          country: "",
        },
      }
    );
    console.log("Updated users to add missing fields");
  } catch (err) {
    console.error("Error updating users", err);
    db.mongoose.connection.close();
  }
}

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req: Req, res: Res) => {
  res.json({ message: "Welcome to my app." });
});

// routes
app.use(AuthRouter);
app.use(UserRouter);
app.use(PostRouter);
app.use(RoleRouter);
app.use(ApartmentRouter);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
  try {
    const count = await RoleModel.estimatedDocumentCount();
    if (count === 0) {
      await Promise.all([
        new RoleModel({ name: "user" }).save(),
        new RoleModel({ name: "moderator" }).save(),
        new RoleModel({ name: "admin" }).save(),
      ]);
      console.log("Roles added successfully.");
    }
  } catch (err) {
    console.error("Error while initializing roles:", err);
  }
}

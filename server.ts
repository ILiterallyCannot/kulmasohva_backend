import { Request as Req, Response as Res, NextFunction as Next } from "express";
import express from "express";
import { dbConfig } from "./app/config/db.config";
import routers from "./app/routes";
import db, { models } from "./app/models";

const cors = require("cors");
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
  db.mongoose.connect(
    `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`
  );
});

async function updateUsers() {
  try {
    await models.user.updateMany(
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
routers.forEach((router) => {
  // routes are imported from app/routes/index.ts
  app.use(router);
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
  try {
    const count = await models.role.estimatedDocumentCount();
    if (count === 0) {
      await Promise.all([
        new models.role({ name: "user" }).save(),
        new models.role({ name: "moderator" }).save(),
        new models.role({ name: "admin" }).save(),
      ]);
      console.log("Roles added successfully.");
    }
  } catch (err) {
    console.error("Error while initializing roles:", err);
  }
}

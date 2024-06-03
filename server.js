const express = require("express");
const cors = require("cors");
const app = express();

const db = require("./app/models");
const dbConfig = require("./app/config/db.config.js");
const authRoutes = require("./app/routes/auth.routes.js");
const userRoutes = require("./app/routes/user.routes.js");
const postRoutes = require("./app/routes/post.routes.js")
const roleRoutes = require("./app/routes/role.routes.js")
const Role = db.role;
const User = db.user;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
    //updateUsers();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit(1);
  });

  db.mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
  });
  
  db.mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB connection lost. Attempting to reconnect...');
    db.mongoose.connect('mongodb://localhost:27017/kulmasohva_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  async function updateUsers() {
    try {
      await User.updateMany(
        { posts: { $exists: false } },
        { $set: { posts: [] } }
      );
      console.log('Updated users to add posts field');
      db.mongoose.connection.close();
    } catch (err) {
      console.error('Error updating users', err);
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
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my app." });
});

// routes
authRoutes(app);
userRoutes(app);
postRoutes(app);
roleRoutes(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      await Promise.all([
        new Role({ name: "user" }).save(),
        new Role({ name: "moderator" }).save(),
        new Role({ name: "admin" }).save(),
      ]);
      console.log("Roles added successfully.");
    }
  } catch (err) {
    console.error("Error while initializing roles:", err);
  }
}

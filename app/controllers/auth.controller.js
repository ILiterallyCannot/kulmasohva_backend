const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    const savedUser = await user.save();
    const userCount = await User.countDocuments();

    if (userCount === 1) {
      const role = await Role.findOne({ name: "admin" });
      if (role) {
        savedUser.roles = [role._id];
        await savedUser.save();
        res.send({
          message: "First user was registered successfully as admin!",
        });
      } else {
        res.status(500).send({ message: "Admin role not found." });
      }
    } else {
      if (req.body.roles && req.body.roles.length > 0) {
        const roles = await Role.find({ name: { $in: req.body.roles } });
        user.roles = roles.map((role) => role._id);
      } else {
        const role = await Role.findOne({ name: "user" });
        user.roles = [role._id];
      }
    await savedUser.save();
    res.send({ message: "User was registered successfully!" });
  }
 } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

exports.signin = (req, res) => {
  let token;
  let authorities = [];
  User.findOne({ username: req.body.username })
    .populate("roles", "-__v")
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal server error" });
    });
};

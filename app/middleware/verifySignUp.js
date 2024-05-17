const db = require("../models");
const User = db.user;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Check if username exists
  User.findOne({
    username: req.body.username
  }).then(user => {
    if (user) {
      res.status(400).send({ message: "Username is already taken!" });
      return;
    }

    // Check if email exists
    User.findOne({
      email: req.body.email
    }).then(user => {
      if (user) {
        res.status(400).send({ message: "Email is already in use!" });
        return;
      }

      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;
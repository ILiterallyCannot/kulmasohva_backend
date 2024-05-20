const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token,
            config.secret,
            (err, decoded) => {
              if (err) {
                return res.status(401).send({
                  message: "Unauthorized!",
                });
              }
              req.userId = decoded.id;
              next();
            });
};

isAdmin = (req, res, next) => {
  if (req.userId) {
  User.findById(req.userId)
  .then(user => {
    Role.find({_id: { $in: user.roles }})
    .then(roles => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }
        // If the loop completes without finding an admin role
        res.status(403).send({ message: "Admin access required!" });
      })
    .catch(err => {
      console.log(err);
      res.status(500).send({ message: err });
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).send({ message: err });
  });
  } else {
    res.status(403).send({ message: "No user ID provided!" });
  }
};

isModerator = (req, res, next) => {
  if (req.userId) {
    User.findById(req.userId)
    .then(user => {
      Role.find({_id: { $in: user.roles }})
      .then(roles => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }
        res.status(403).send({ message: "Moderator Rights Required!" });
      })
      .catch(err => {
        console.log(err);
        res.status(500).send({ message: err });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ message: err });
    });
  } else {
    res.status(403).send({ message: "No user ID provided!" });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;
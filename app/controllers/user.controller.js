exports.allAccess = (req, res) => {
  res.status(200).send("Public Content visible to anyone.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("Registered User only Area.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content only visible to admins.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Content only visible to moderators.");
};

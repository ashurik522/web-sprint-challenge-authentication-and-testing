const Users = require("./users-model");

const inputCheck = (req, res, next) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).json({ message: "username and password required" });
    return;
  }
  if (username.trim() === "" || password.trim() === "") {
    res.status(400).json({ message: "username and password required" });
    return;
  }
  next();
};

const checkUsernameExists = async (req, res, next) => {
  const result = await Users.findBy({ username: req.body.username }).first();
  if (result != null) {
    res.status(422).json({ message: "username taken" });
    return;
  }
  next();
};

module.exports = {
  inputCheck,
  checkUsernameExists,
};

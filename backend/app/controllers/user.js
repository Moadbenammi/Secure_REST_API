const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../config/config");

const User = require("../models/user");

exports.signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser)
      return res.status(400).json({ message: "Utilisateur déja existant!" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, TOKEN_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ result, token });
  } catch (error) {
      console.log(error)
    res.status(500).json({ message: "Ca n'a pas bien marché!" });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Informations incorrectes" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id },  TOKEN_SECRET, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Ca n'a pas bien marché!" });
  }
};

const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");
const { createHash } = require("../utils/hashBcrypt.js");

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .send({ error: "El correo electrónico ya está registrado" });
    }

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      password: createHash(password),
      age,
      rol:
        email === "adminCoder@coder.com" && password === "adminCod3r123"
          ? "admin"
          : "usuario",
    });

    req.session.login = true;

    req.session.user = { ...newUser._doc };

    res.redirect("/products");
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

module.exports = router;

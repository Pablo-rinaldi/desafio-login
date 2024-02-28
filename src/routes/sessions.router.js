const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");
const { isValidPassword } = require("../utils/hashBcrypt.js");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await UserModel.findOne({ email: email });
    if (usuario) {
      if (isValidPassword(password, usuario)) {
        req.session.login = true;
        req.session.user = {
          email: usuario.email,
          age: usuario.age,
          first_name: usuario.first_name,
          last_name: usuario.last_name,
          rol: usuario.rol,
        };

        res.redirect("/products");
      } else {
        res.status(401).send({ error: "Contraseña no valida" });
      }
    } else {
      if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        req.session.login = true;
        req.session.user = {
          email: "adminCoder@coder.com",
          first_name: "admin",
          rol: "admin",
        };
        res.redirect("/products");
      } else {
        res.status(404).send({ error: "Usuario no encontrado" });
      }
    }
  } catch (error) {
    res.status(400).send({ error: "Error en el login" });
  }
});

router.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.redirect("/login");
});

module.exports = router;

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://pablohrinaldi:jimbobimbo@cluster0.rhjud7m.mongodb.net/ecommerce?retryWrites=true&w=majority"
  )
  .then(() => console.log("Conectado a la base de datos"))
  .catch((error) => console.log(error));


/*****CONEXIÓN A LA BASE DE DATOS*****/
const mongoose = require("mongoose");
const connection = "mongodb://localhost/proyecto";
mongoose.connect(connection, {})
  .then(() => console.log("Base de datos conectada con éxito"))
  .catch((err) => console.log(err));


  
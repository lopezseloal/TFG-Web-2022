const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UsuarioSchema= new Schema({
    nombre: { type: String, required: true },
    nomusuario: {type: String, required: true},
    email: { type: String, required: true },
    clave: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    admin: {type: Boolean, default: false}
});

UsuarioSchema.methods.encryptPassword = async(clave) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(clave,salt);
    return hash;
};

UsuarioSchema.methods.matchPassword = async function(clave){
    return await bcrypt.compare(clave,this.clave);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);

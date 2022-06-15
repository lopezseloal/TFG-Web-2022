const mongoose = require('mongoose');
const {Schema} = mongoose;

const NoticiaSchema = new Schema({
    titular: {type:String, required:true},
    subtitulo: {type: String, required:true},
    descripcion: {type:String, required:true},
    fecha: {type: Date, default: Date.now},
    imagen: {type: String, required:true},
    categoria: {type: String, required: true},
    nacional: {type:Boolean,default:false},
    internacional: {type: Boolean,default:false},
    deportes: {type:Boolean, default:false}
});

module.exports = mongoose.model('Noticia', NoticiaSchema);
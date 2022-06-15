

/*****CREAMOS RUTAS (Llamamos a una URL y renderizamos un fichero hbs)*****/
const express = require('express'); //Requerimos express para crear rutas
const router = express.Router();
const Noticia = require('../models/Noticia'); //Requerimos el modelo Noticia

//Renderiza la vista 'menu' en la URL '/inicio' con los datos del modelo 'Noticia'
router.get('/inicio',async(req,res) => {
    const noticias = await Noticia.find().lean().sort({fecha: 'desc'}); 
    res.render('./menu',{noticias}); 
});

//Si introducimos en la URL 'localhost:4000' nos redirige a inicio
router.get('/',(req,res)=> {
    res.redirect('inicio');
});

//Renderiza la vista 'sobre-nosotros' en la URL '/sobre-nosotros'
router.get('/sobre-nosotros',(req,res) => {
    res.render('sobre-nosotros');
});

//Renderiza la vista 'sobre-nosotros' en la URL '/sobre-nosotros'
router.get('/redes-sociales',(req,res) => {
    res.render('redes-sociales');
});

//Renderiza en la vista 'usuarios/perfil' en la URL '/usuarios/perfil'
router.get('/usuarios/perfil',(req,res) => {
    res.render('usuarios/perfil');
});

module.exports = router;
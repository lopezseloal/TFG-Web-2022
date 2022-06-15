
//CREAMOS RUTAS (Llamamos a una URL y renderizamos un fichero hbs)
const express = require('express'); //Requerimos express para crear rutas
const router = express.Router();
const Noticia = require('../models/Noticia'); //Requerimos el modelo Noticia
const{isAuthenticated} = require('../helpers/authentication'); //Obliga a iniciar sesión ("Acceso restringido")
const{isAuthenticated2} = require('../helpers/authentication'); //Obliga a iniciar sesión ("Debe iniciar sesión")

/*****TODAS LAS NOTICIAS*****/
//Renderiza la vista 'noticias/todas-noticias' en la URL 
router.get('/noticias',async(req, res) => {
    let noticias = await Noticia.find().lean().sort({fecha: 'desc'});
    res.render('noticias/todas-noticias', {noticias});
});

/*****NUEVA NOTICIA*****/
router.get('/noticias/nueva-noticia', isAuthenticated,(req, res) => { 
    res.render('noticias/nueva-noticia');
});

router.post('/noticias/nueva-noticia',isAuthenticated, async(req, res) => {
    let { titular, subtitulo, descripcion, imagen, categoria, nacional, internacional, deportes } = req.body;
    
    if(categoria == "nacional"){
        nacional = true;
    }
    if(categoria == "Nacional"){
        nacional = true;
        categoria = "nacional";
    }
    else if(categoria == "internacional"){
        internacional = true;
    }
    else if(categoria == "Internacional"){
        internacional = true;
        categoria = "internacional";
    }
    else if(categoria == "deportes"){
        deportes = true;
    }
    else if(categoria == "Deportes"){
        deportes = true;
        categoria = "deportes";
    }

    const errores = [];
    if(!titular && !subtitulo && !descripcion && !categoria && !imagen){
        errores.push({ text: 'Por favor, inserte algún valor.' });
    }
    else if (!titular) {
        errores.push({ text: 'Por favor, inserte un titular.' });
    }
    else if (!subtitulo) {
        errores.push({ text: 'Por favor, inserte un subtítulo.' });
    }
    else if(titular.length>150){
        errores.push({ text: 'Por favor, inserte un titular más corto (150 caracteres máximo).' });
    }
    else if(subtitulo.length>250){
        errores.push({ text: 'Por favor, inserte un subtítulo más corto (250 caracteres máximo).' });
    }
    else if (!descripcion) {
        errores.push({ text: 'Por favor, inserte una descripcion.' })
    }
    else if(categoria.length <= 0){
        errores.push({ text: 'Debe introducir una categoría: Nacional, Internacional o Deportes.' });
    }
    else if(categoria != "nacional" && categoria != "internacional" && categoria != "deportes" && categoria != "Nacional" && categoria != "Internacional" && categoria != "Deportes"){
        errores.push({ text: 'Categoría no válida: inserte una de las siguientes: Nacional, Internacional o Deportes.' });
    }
    else if (!imagen) {
        errores.push({ text: 'Por favor, inserte una imagen.' })
    }
    if (errores.length > 0) {
        res.render('noticias/nueva-noticia', {
            errores,
            titular,
            subtitulo,
            descripcion,
            imagen,
            categoria
        });
    }

    else {
        let nuevaNoticia = new Noticia({titular,subtitulo,descripcion,imagen,categoria,nacional, internacional, deportes});
        await nuevaNoticia.save();
        req.flash('success_msg','La noticia ha sido publicada con éxito');
        res.redirect('/noticias');
    }
});

/*****EDITAR NOTICIA*****/
router.get('/noticias/editar-noticia/:id',isAuthenticated, async(req,res) => {
    const noticia = await Noticia.findById(req.params.id).lean();
    res.render('noticias/editar-noticia', {noticia});
});

router.put('/noticias/editar-noticia/:id',isAuthenticated, async(req,res) => {
    let {titular,subtitulo,descripcion,imagen,categoria,nacional, internacional, deportes} = req.body;
    
    nacional = false; //Volvemos a iniciar las variables para que no se dupliquen en las categorías
    internacional = false;
    deportes = false;

    if(categoria == "nacional"){
        nacional = true;
    }
    if(categoria == "Nacional"){
        nacional = true;
        categoria = "nacional";
    }
    else if(categoria == "internacional"){
        internacional = true;
    }
    else if(categoria == "Internacional"){
        internacional = true;
        categoria = "internacional";
    }
    else if(categoria == "deportes"){
        deportes = true;
    }
    else if(categoria == "Deportes"){
        deportes = true;
        categoria = "deportes";
    }
    const errores = [];

    if(!titular && !subtitulo && !descripcion && !categoria && !imagen){
        errores.push({ text: 'Por favor, inserte algún valor.' });
    }
    else if (!titular) {
        errores.push({ text: 'Por favor, inserte un titular.' });
    }
    else if (!subtitulo) {
        errores.push({ text: 'Por favor, inserte un subtítulo.' });
    }
    else if(titular.length>150){
        errores.push({ text: 'Por favor, inserte un titular más corto (150 caracteres máximo).' });
    }
    else if(subtitulo.length>250){
        errores.push({ text: 'Por favor, inserte un subtítulo más corto (250 caracteres máximo).' });
    }
    
    else if (!descripcion) {
        errores.push({ text: 'Por favor, inserte una descripcion.' })
    }
    else if (!imagen) {
        errores.push({ text: 'Por favor, inserte una imagen.' })
    }
    else if(categoria.length <= 0){
        errores.push({ text: 'Debe introducir una categoría: Nacional, Internacional o Deportes.' });
    }
    else if(categoria != "nacional" && categoria != "internacional" && categoria != "deportes" && categoria != "Nacional" && categoria != "Internacional" && categoria != "Deportes"){
        errores.push({ text: 'Categoría no válida: inserte una de las siguientes: Nacional, Internacional o Deportes.' });
    }
    
    if (errores.length > 0) {
        res.render('noticias/editar-noticia', {
            errores,
            titular,
            subtitulo,
            descripcion,
            imagen,
            categoria
        });
    }

    else{
        await Noticia.findByIdAndUpdate(req.params.id, {titular,subtitulo,descripcion,imagen,categoria,nacional, internacional, deportes});
        req.flash('success_msg','La noticia ha sido actualizada con éxito');
        res.redirect('/noticias')
    }
});

/*****LEER NOTICIA*****/
router.get('/noticias/leer-noticia',async(req,res) => {
    const noticias = await Noticia.find().lean().sort({fecha: 'desc'});
    res.render('noticias/leer-noticia',{noticias});
})

router.get('/noticias/leer-noticia/:id',isAuthenticated2,async (req,res) => {
    const noticia =  await Noticia.findById(req.params.id).lean();
    res.render('noticias/leer-noticia',{noticia});
});

router.delete('/noticias/eliminar/:id',isAuthenticated, async(req,res) => {
    await Noticia.findByIdAndDelete(req.params.id);
    req.flash('success_msg','La noticia ha sido eliminada con éxito');
    res.redirect('/noticias');
});


/*****CATEGORIAS*****/
router.get('/noticias/nacional',async(req, res) => {

    const noticias = await Noticia.find().lean().sort({fecha: 'desc'});
    res.render('noticias/nacional', {noticias});
});

router.get('/noticias/internacional',async(req, res) => {

    const noticias = await Noticia.find().lean().sort({fecha: 'desc'});
    res.render('noticias/internacional', {noticias});
});

router.get('/noticias/deportes',async(req, res) => {

    const noticias = await Noticia.find().lean().sort({fecha: 'desc'});
    res.render('noticias/deportes', {noticias});
});

/****NAVEGACIÓN****/
router.get('/noticias', isAuthenticated,async(req, res) => {
    const noticias = await Noticia.find().lean().sort({fecha: 'desc'});
    res.render('partials/navigation', {noticias});
});

module.exports = router;
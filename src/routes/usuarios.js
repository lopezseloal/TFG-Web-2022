
/*****CREAMOS RUTAS (Llamamos a una URL y renderizamos un fichero .hbs)*****/
const express = require('express'); //Requerimos express para crear rutas
const router = express.Router();
const Usuario = require('../models/Usuario'); //Requerimos el modelo Usuario
const passport = require('passport'); //Requerimos passport
const mongoose = require('mongoose'); //Requerimos módulo mongoose para la base de datos
const bcrypt = require('bcryptjs'); //Requerimos bcrypt para encriptar claves
const { Schema } = mongoose; //Requerimos esquema de datos
const{isAuthenticated} = require('../helpers/authentication'); //Obliga a iniciar sesión ("Acceso restringido")
const{isAuthenticated2} = require('../helpers/authentication'); //Obliga a iniciar sesión ("Debe iniciar sesión")

/*****INICIAR SESIÓN*****/
router.get('/usuarios/iniciar-sesion', (req, res) => { //URL para que el usuario se loguee
    res.render('usuarios/iniciar-sesion'); //Renderiza el hbs del fichero iniciar-sesion
});

router.post('/usuarios/iniciar-sesion', passport.authenticate('local', { //Formulario para autenticarse
    successRedirect: '/inicio',
    failureRedirect: '/usuarios/iniciar-sesion',
    badRequestMessage: 'Error, compruebe los datos introducidos',
    failureFlash: true
}));

/*****REGISTRAR CUENTA*****/
router.get('/usuarios/registro', (req, res) => {
    res.render('usuarios/registro');
});

router.post('/usuarios/registro', async (req, res) => {
    const { nombre, nomusuario, email, clave, confclave } = req.body;
    const errores = [];
    const emailUsuario = await Usuario.findOne({ email: email });
    const nomusuarioUsuario = await Usuario.findOne({ nomusuario: nomusuario });
    console.log("Clave: "+clave)

    //Mostrar errores
    if (nombre.length == 0 && nomusuario.length == 0 && clave.length == 0 && email.length == 0 && confclave.length == 0) {
        errores.push({ text: 'Por favor, introduce algún valor' });
    }
    else if (nombre.length == 0) {
        errores.push({ text: 'Por favor, introduce tu nombre' });
    }
    else if (nomusuario.length == 0) {
        errores.push({ text: 'Por favor, introduce tu usuario' });
    }
    else if (email.length == 0) {
        errores.push({ text: 'Por favor, introduce tu email' });
    }
    else if (clave != confclave) {
        errores.push({ text: 'Las contraseñas no coinciden' });
    }
    else if (clave.length < 4) {
        errores.push({ text: 'La contraseña debe ser de una longitud mayor a 4' });
    }
    if (errores.length > 0) {
        res.render('usuarios/registro', { errores, nombre, email, clave, confclave });
    }
    else if (emailUsuario) {
        req.flash('error_msg', 'El email introducido ya está en uso, por favor, prueba a registrarte con otro');
        res.redirect('/usuarios/registro')
    }
    else if (nomusuarioUsuario) {
        req.flash('error_msg', 'El usuario introducido ya está en uso, por favor, prueba a registrarte con otro');
        res.redirect('/usuarios/registro')
    }

    //Si no hay ningún error
    else {
        const nuevoUsuario = new Usuario({ nombre, nomusuario, email, clave });
        console.log("Clave despues: "+clave)
        const claveDescif = nuevoUsuario.clave; 
        nuevoUsuario.clave = await nuevoUsuario.encryptPassword(clave);
        await nuevoUsuario.save();
        req.flash('success_msg', 'El usuario ha sido registrado con éxito');
        res.redirect('/usuarios/iniciar-sesion');
    }

});

/*****CERRAR SESIÓN*****/
router.get('/usuarios/cerrar-sesion', (req, res) => {
    req.logout();
    res.redirect('/inicio');
});

/*****EDITAR DATOS*****/
router.get('/usuarios/perfil/editar-perfil/:id', isAuthenticated,async (req, res) => {
    const user = await Usuario.findById(req.params.id).lean();
    res.render('usuarios/editar-perfil', { user });
});

router.put('/usuarios/perfil/editar-perfil/:id', isAuthenticated, async (req, res) => {
    const { nombre, nomusuario, email, clave } = req.body;
    await Usuario.findByIdAndUpdate(req.params.id, { nombre, nomusuario, email, clave });
    req.flash('success_msg', 'Los datos del usuario han sido editados con éxito');
    res.redirect('/usuarios/perfil');
});


/*****ELIMINAR PERFIL*****/
router.get('/usuarios/perfil/eliminar-perfil/:id', isAuthenticated,async (req, res) => {
    const user = await Usuario.findById(req.params.id).lean();
    res.render('usuarios/perfil', { user });
});

router.delete('/usuarios/eliminar/:id', isAuthenticated, async (req, res) => {
    await Usuario.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'El usuario ha sido eliminado con éxito');
    res.redirect('/usuarios/iniciar-sesion');
});

module.exports = router;

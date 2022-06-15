

const helpers = {}

helpers.isAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }

    req.flash('error_msg','ACCESO RESTRINGIDO');
    res.redirect('/usuarios/iniciar-sesion');
};

helpers.isAuthenticated2 = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }

    req.flash('error_msg','Para acceder al contenido de esta noticia debe iniciar sesión con su cuenta');
    res.redirect('/usuarios/iniciar-sesion');
};

module.exports = helpers;


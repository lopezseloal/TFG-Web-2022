const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/Usuario');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'clave'
}, async (email,clave,done) => {
    const usuario = await Usuario.findOne({email:email});

    
    if(!usuario){
        return done(null,false,{message:'Usuario no encontrado'});
    }
    else{
        const match = await usuario.matchPassword(clave);
        if(match){
            return done(null,usuario);
        }
        else{
            return done(null,false,{message:'Clave incorrecta'});
        }
    }
}));

passport.serializeUser((usuario,done) => {
    done(null,usuario.id);
});

passport.deserializeUser((id,done) => {
    Usuario.findById(id,(err,usuario) => {
        done(err,usuario);
    });
});
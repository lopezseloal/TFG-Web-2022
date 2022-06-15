
/*****IMPORTACIONES*****/
const express = require ('express'); //Importamos express para ejecutar nuestro servidor
const path = require('path'); //Módulo de Node
const exphbs = require('express-handlebars'); //Módulo de hbs, mejor que los html
const methodOverride = require('method-override'); //Método override para enviar métodos en formularios
const session = require('express-session'); //Módulo de sesión que guarda los datos de usuarios en la sesión
const flash = require('connect-flash'); //Mensajes de error
const passport = require('passport'); //Importar passport

/*****INICIALIZACIONES*****/
const app = express();
require('./database');
require('./config/passport');

/*****CONFIGURACIONES*****/
app.set('port',process.env.PORT || 4000); //Establecemos puerto
app.set('views',path.join(__dirname, 'views')); //Concatena carpetas

    //Configuramos las vistas de hbs
app.engine('.hbs',exphbs ({ 
    defaultLayout:'main', //Propiedad para establecer un fichero como layout, en este caso main
    layoutsDir:path.join(app.get('views'),'layouts'), //Propiedad para concatenar vistas con layouts
    partialsDir:path.join(app.get('views'),'partials'), //Propiedad para concatenar vistas con partials
    extname:'.hbs'//Establecemos la extensión de los archivos (handlebars => .hbs)
}));
app.set('view engine','.hbs'); //Configuramos el motor de las vistas, con hbs

/*****MIDDLEWARES (funciones que ejecutamos)*****/
app.use(express.urlencoded({extended:false})); //Método para interpretar datos de un formulario
app.use(methodOverride('_method')); //Método override para enviar métodos en formularios
app.use(session({ //Módulo de sesión que guarda los datos de usuarios en la sesión
    secret:'Proyecto Web',
    resave:true, 
    saveUninitialized:true
}));
app.use(express.static("../../../src/public/imagenes"));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/*****VARIABLES GLOBALES (datos accesibles desde toda la web)*****/ 
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    let user = null;
    let noticia = null;

    if(req.user){
        user = JSON.parse(JSON.stringify(req.user))
    }
    if(req.noticia){
        noticia = JSON.parse(JSON.stringify(req.noticia))
    }
    
    res.locals.user = user;
    res.locals.noticia = noticia;
    
    next();
});

/*****RUTAS (requerimos las rutas del servidor)*****/ 
app.use(require('./routes/index')); 
app.use(require('./routes/noticias'));
app.use(require('./routes/usuarios'));

/*****ARCHIVOS ESTÁTICOS (configuramos los ficheros estáticos)*****/
app.use(express.static(path.join(__dirname,'public'))); 

/*****ARRANCAMOS EL SERVIDOR*****/
app.listen(app.get('port'), () => {
    console.log('Servidor ejecutándose en el puerto:', app.get('port'));
});
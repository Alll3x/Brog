//importando 
    //express
        const express = require('express');
        const app = express(); 
    //handlebars
        const handlebars = require('express-handlebars');
    //mongoose
        const mongoose = require('mongoose');
    // rotas
        const admin = require('./routes/admin');
        const usuarios = require("./routes/usuario");
        const path = require('path');
    //session e flash
        const session = require("express-session");
        const flash = require("connect-flash");
    //modulo de postagem
        require("./models/Postagem");   
        const Postagem = mongoose.model("postagens");
    //modulo de categoria
        require("./models/Categoria");
        const Categoria = mongoose.model("categorias");
    //Passport
        const passport = require("passport");   
        require("./config/auth")(passport);
    //helper
        const {eUser}= require("./helpers/eUser");   

//configurações 
    //Sessão
    app.use(session({
        secret:"cursonode",
        resave: true,
        saveUninitialized: true
    }));
    //passport
    app.use(passport.initialize());
    app.use(passport.session());
    //flash
    app.use(flash());
    //middlewares
    app.use((req, res, next)=>{
        //variaveis globais
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        res.locals.error = req.flash("error");
        res.locals.user = req.user || null;
        next();
    });
    //config do Engine HandleBars
        app.engine('handlebars', handlebars.engine({defautLayout: 'main',
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true,
        }}));
    app.set('view engine', 'handlebars');
    //urlencoder
        app.use(express.urlencoded({extended: true}));
        app.use(express.json());
    //Mongoose
        mongoose.Promise = global.Promise;
       mongoose.connect('mongodb://localhost/blogapp').then(()=>{
        console.log("DataBase On-line");
       }).catch((err)=>{
        console.log("Erro ao se conectar" + err);
       })
    //Public
        app.use(express.static(path.join(__dirname,'public')));

    
//Rotas
       app.get("/", (req, res)=>{
        Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens)=>{
            res.render("index", {postagens: postagens});
        }).catch((err)=>{
            req.flash("error_msg","Erro ao carregar postagens");
            res.redirect("/404");
        })
      
       });

       app.get("/404", (req, res)=>{
            res.send("Erro 404");
       }), 

        app.get("/postagem/:slug",eUser, (req, res)=>{
        Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
            if(postagem){
                res.render("postagem/index", {postagem: postagem});
            }else{
            req.flash("error_msg", "Esta postagem não existe ou não foi encontrada");
            res.redirect("/");
            }
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro inesperado");
            res.redirect("/");
        });
        });

        app.get("/categorias", (req, res)=>{
            Categoria.find().then((categorias)=>{
                res.render("categorias/index", {categorias: categorias});
            }).catch((err)=>{
                req.flash("error_msg", "Houve um erro ao listar as categorias");
                res.redirect("/");
            });
        });

        app.get("/categorias/:slug", eUser, (req, res)=>{
            Categoria.findOne({slug: req.params.slug}).then((categoria)=>{
                if(categoria){

                        Postagem.find({categoria: categoria._id}).then((postagens)=>{
                            res.render("categorias/postagens", {postagens: postagens, categoria: categoria});
                        }).catch((err)=>{
                            req.flash("error_msg", "Houve um erro inesperado");
                            res.redirect("/");
                        })

                }else{
                    req.flash("error_msg", "Esta categoria não existe");
                    res.redirect("/");
                }
            }).catch((err)=>{
                req.flash("error_msg", "Houve um erro inesperado");
                res.redirect("/");
            });
        });

    app.use('/admin', admin);
    app.use("/usuarios", usuarios);
//outros
    //setando a porta
    const PORT = 8081;
    app.listen(PORT, ()=>{
        try {
            console.log("Server On-line");
        } catch (error) {
            console.log("Falha ao se conectar com servido " + error);
        }
    });
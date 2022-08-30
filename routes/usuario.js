const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

require("../models/usuario");
const Usuario = mongoose.model("usuarios");

const passport = require("passport");
    //helper
        const {eUser}= require("../helpers/eUser");   


//rotas
    //get
        router.get("/registro", (req, res)=>{
            res.render("usuario/registro");
        });

        router.get("/login", (req, res)=>{
            res.render("usuario/login");
        });

        router.get('/logout', (req, res, next) => {
            req.logout((err) =>{
                if (err) { return next(err) }
                req.flash("success_msg", "Saiu com sucesso");
                res.redirect('/');
              });
        });
    //post
        router.post("/registro", (req, res)=>{
            var erros = [];
            if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                erros.push({texto: "Nome inválido"});
            }

            if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
                erros.push({texto: "Email inválido"});
            }

            if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
                erros.push({texto: "Senha inválida"});
            }

            if(req.body.senha.length < 4 ){
                erros.push({texto: "Senha muito curta"});
            }

            if(req.body.senha != req.body.repeat ){
                erros.push({texto: "As senhas são diferentes"});
            }

            if(erros.length > 0){

                res.render("usuario/registro", {erros: erros});

            }else{ 
                Usuario.findOne({email: req.body.email}).then((usuario)=>{
                    if(usuario){
                        req.flash("error_msg", "Já existe uma conta com esse mail, use outro ou faça login");
                        res.redirect("/usuarios/registro");
                        console.log(" erro verificar");
                    }else{
                        const novoUsuario = new Usuario({
                            nome: req.body.nome,
                            email: req.body.email,
                            senha: req.body.senha
                            
                        });
                        console.log(" verificar");
                        bcrypt.genSalt(10,(erro, salt) =>{
                            bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=>{
                                if(erro){
                                    req.flash("error_msg", "Houve um erro durante o salvamento do usuário");
                                    res.redirect("/");
                                }else{
                                    novoUsuario.senha = hash;

                                    novoUsuario.save().then(()=>{
                                        req.flash("success_msg", "Usuario criado com sucesso");
                                        res.redirect("/");
                                    }).catch((err)=>{
                                        req.flash("error_msg", "Houve um erro ao criar o suario");
                                        res.redirect("/usuarios/registro");
                                    })
                                }
                            });
                        });

                    }
                }).catch((err)=>{
                    req.flash("error_msg", "Houve um erro interno");
                    res.redirect("/");
                })
            }
        });

        router.post("/login", (req, res, next)=>{
            passport.authenticate("local", {
                successRedirect: "/",
                failureRedirect: "/usuarios/login",
                failureFlash: true
            })(req, res, next);
        });



module.exports = router;
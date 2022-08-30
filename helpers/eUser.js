module.exports = {
    eUser: function(req, res, next){
        
        if(req.isAuthenticated() && req.user.eAdmin ==0){
            return next();
        }

        req.flash("error_msg", "Crie uma conta para acessar o resto do Brog");
        res.redirect("/");
    }
}
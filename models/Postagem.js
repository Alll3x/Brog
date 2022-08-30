const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Postagem = new Schema({
    titulo:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    conteudo:{
        type: String,
        required: true
    },
    categoria:{
        type: Schema.Types.ObjectId,    //linkando com as categorias ja criadas via id
        ref: "categorias", // tem que colocar a referencia do modelo de categoria
        required: true
    },
    data:{
        type: Date,
        default: Date.now()
    }
});


mongoose.model("postagens", Postagem)
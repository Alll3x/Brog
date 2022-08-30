   if(process.env.NODE_ENV == "production"){
    module.exports={mongoURI:'mongodb+srv://al3x:131601131601@brog.r4p8qbf.mongodb.net/?retryWrites=true&w=majority' }
   }else{
    module.exports={mongoURI: 'mongodb://localhost/blogapp'}
   }
   

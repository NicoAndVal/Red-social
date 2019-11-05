const mongoose = require('mongoose')

const {database} = require('./keys')

mongoose.connect(database.URI, {
    useNewUrlParser: false
}).then(db => console.log(`La base de datos esta conectada`))
.catch(err => console.log(err))
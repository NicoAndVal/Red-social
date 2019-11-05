const express = require('express')

const config = require('./server/config')

//base de datos
require('./database')

const app = config(express())


app.listen(app.get('port'), ()  =>{
    console.log(`Servidor escuchando en el puerto ${app.get('port')}`)
}) 
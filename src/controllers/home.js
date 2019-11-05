ctrl = {}

const {Image} = require('../models/index')

ctrl.index = async (req,res) =>{
    const images = await Image.find().sort({timestamp: -1})
    console.log(images)
    res.render('index', {images})
}

module.exports = ctrl
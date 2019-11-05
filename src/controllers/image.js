ctrl = {}
const path = require('path')
const {randoNumber} = require('../helpers/libs')
const fs = require('fs-extra')
const md5 = require('md5')

const {Image} = require('../models/index')
const {Comment} = require('../models/index')


ctrl.index = async (req,res) =>{
    const viewModels = {image: {}, comments:{}}
    const image = await Image.findOne({filename:{$regex: req.params.image_id}})
    if(image){
        image.views = image.views + 1
        viewModels.image = image
        image.save()
        const comments = await Comment.find({image_id: image._id})
        viewModels.comments = comments
        res.render('images',viewModels)
    }else{
        res.redirect('/')
    }
}


ctrl.create = (req,res) =>{
    const imageSaved = async() =>{
        const imgUrl = randoNumber()
        const images =  await Image.find({filename: imgUrl})
        if(images.length > 0){
            imageSaved()
        }else{
            const imagePathTemp = req.file.path
            const ext = path.extname(req.file.originalname).toLowerCase()
            const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`)
            console.log(targetPath)
            if(ext ==='.jpg' || ext ==='.jpeg' || ext ==='.gif'||ext ==='.png'){
                await fs.rename(imagePathTemp, targetPath)
                const newImage = new Image({
                    title: req.body.title,
                    description: req.body.description,
                    filename: imgUrl + ext
                })
        
                const imageSaved =await newImage.save()
                res.redirect('/images/'+imgUrl)
                res.send('Funciona')
            }else{
                fs.unlink(imagePathTemp)
                res.status(500).json({error:'Solo las imagenes estás permitidas'})
            }
        }

    }

    imageSaved()

}


ctrl.like = async(req,res) =>{
    const image = await Image.findOne({filename:{$regex: req.params.image_id}})
    if(image){
        image.likes = image.likes + 1
        await image.save()
        res.json({likes:image.likes })
    }else{
        res.status(500).json({error: 'Error interno'})
    }
    
}
ctrl.comment = async(req,res) =>{
   
    const image = await Image.findOne({filename:{$regex: req.params.image_id}})
    if(image){
        const newComment = new Comment(req.body)
        newComment.gravatar = md5(newComment.email);
        newComment.image_id = image._id
        await newComment.save()
        res.redirect(`/images/${image.uniqueId}`)
    }else{
        res.redirect('/')
    }


    
}
ctrl.remove = async(req,res) =>{
    const image = await Image.findOne({filename:{$regex: req.params.image_id}})

    if(image){
        await fs.unlink(path.resolve('./src/public/upload/' + image.filename));
        await Comment.deleteOne({image_id: image._id})
        await image.remove()
        res.json(true)
    }

}   

module.exports = ctrl
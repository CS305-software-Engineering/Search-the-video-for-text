const express = require('express')
const router = express.Router()

const Auth = require("../middleware/Auth.js")
const upload = require('../controllers/Upload Handler/receive_file.js').upload
const videoSizeChecker = require('../middleware/upload_middleware.js').videoSizeChecker
const videoFormatChecker = require('../middleware/upload_middleware.js').videoFormatChecker


router.use(Auth.verifyToken)


router.use(videoSizeChecker)


router.post('/',upload.single('file'), function(req,res){

    if(!req.file){
        return res.status(422).send({'message': 'Please send a video File'})
    }else{
        console.log('File Uploaded')
        console.log(req.file)

        // req.file.buffer gives file buffer
        //now transcribe use catch for error
        res.status(200).send({"message" : "File Uploaded"})
    }

})

module.exports = router
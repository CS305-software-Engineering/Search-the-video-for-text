const express = require('express')
const router = express.Router()

const Auth = require("../middleware/Auth.js")
const receive_file = require('../controllers/Upload Handler/receive_file.js').receiveFile
const videoSizeChecker = require('../middleware/upload_middleware.js').videoSizeChecker

router.use(Auth.verifyToken)

router.use(videoSizeChecker)

router.post('/', function(req,res){
    receive_file(req,res).then( video =>{
        console.log('File Uploaded')
        console.log(video)
        res.status(200).send({"message" : "File Uploaded"})
    }).catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

module.exports = router
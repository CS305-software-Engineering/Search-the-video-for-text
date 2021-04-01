const path = require('path');

const MAX_VIDEO_SIZE = 52428800 //50MB
const VALID_VIDEO_FORMATS = ['.mov' ,'.wav', '.mp3', '.mp4', '.m4a', '.mxf', '.ogg']


function videoSizeChecker(req,res,next){
    console.log('File size is ',req.headers['content-length'])
    if( MAX_VIDEO_SIZE > Number(req.headers['content-length'])){
        next()
    }else{
        return res.status(422).send({'Error': 'SIZE OF FILE > 50MB'})
    }
}

 function videoFormatChecker(req, file, callback){

    var ext = path.extname(file.originalname);

    console.log('EXT IS ',ext," INDEX IS ",VALID_VIDEO_FORMATS.indexOf(ext))

    if(VALID_VIDEO_FORMATS.indexOf(ext) > -1) {
        callback(null, true)
    }
    return callback(null, false)
    

}

module.exports = {
    videoSizeChecker,
    videoFormatChecker
}

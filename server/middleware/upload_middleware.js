const MAX_VIDEO_SIZE = 52428800 //50MB
const VALID_VIDEO_FORMATS = ['mov' ,'wav', 'mp3', 'mp4', 'm4a', 'mxf', 'ogg']

const fileType = require('file-type');

function videoSizeChecker(req,res,next){
    //console.log('File size is ',req.headers['content-length'])
    if( MAX_VIDEO_SIZE > Number(req.headers['content-length'])){
        next()
    }else{
        return res.status(422).send({'Error': 'SIZE OF FILE > 50MB'})
    }
}

 function videoFormatChecker(chunk){

    console.log('Checking File Format',chunk)

    const fileFormat =  fileType(chunk)
    console.log('Format is ',fileFormat)
    if(fileFormat != null && VALID_VIDEO_FORMATS.indexOf(fileFormat.ext) > -1){
        return true
    }else{
        console.log('Returning false ',fileFormat)
        return false
    }
}

module.exports = {
    videoSizeChecker,
    videoFormatChecker
}

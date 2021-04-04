
const videoFormatChecker = require('../../middleware/upload_middleware.js').videoFormatChecker
const multer = require('multer')


var storage = multer.memoryStorage()
var upload = multer({ 
    storage: storage,
    fileFilter: (req, file, callback) => videoFormatChecker(req, file, callback)
})



module.exports = {
    upload
}
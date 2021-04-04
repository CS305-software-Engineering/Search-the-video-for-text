const express = require('express')
const router = express.Router()
const fs = require('fs');
var path = require('path');
const jobs = require('../controllers/Jobs/jobs');


const Auth = require("../middleware/Auth.js")
const upload = require('../controllers/Upload Handler/receive_file.js').upload
const videoSizeChecker = require('../middleware/upload_middleware.js').videoSizeChecker
const videoFormatChecker = require('../middleware/upload_middleware.js').videoFormatChecker



router.use(Auth.verifyToken)


router.use(videoSizeChecker)


router.post('/', upload.single('file'), function (req, res) {

    if (!req.file) {
        return res.status(422).send({ 'message': 'Please send a video File' })
    } else {
        jobs.create(req.file.buffer).then(
            jobID => {
                res.status(200).send({ "message": "Job Created", "id": `${jobID}` })
            }
        ).catch(
            error => {
                console.log(error);
                res.status(500).send({status : 'error', reason : err.reason || err})
            }
        );
        // console.log('File Uploaded')
        // console.log(req.file)
        // fs.open(`server/tmp/${new Date().valueOf()}${path.extname(req.file.originalname)}`, 'w', function (err, fd) {
        //     if(err) console.log(err);
        //     else {
        //         fs.write(fd, req.file.buffer, 0, req.file.buffer.length, null, function (err) {
        //             if (err) throw 'error writing file: ' + err;
        //             fs.close(fd, function () {
        //                 console.log('wrote the file successfully');
        //             });
        //         });
        //     }
        // });
        // req.file.buffer gives file buffer
        //now transcribe use catch for error
        // res.status(200).send({ "message": "File Uploaded" })
    }

})

module.exports = router
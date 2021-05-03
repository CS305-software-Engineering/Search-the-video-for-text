const express = require('express');
const router = express.Router();

const Auth = require("../middleware/Auth.js")
const S3_Service = require("../controllers/Storage Service/s3_bucket_operations.js")

router.use(Auth.verifyToken)

router.post('/', (req, res) => {

    const videoID = req.body.video_id;
    console.log("Request received to get vid streaming link")

    console.log(`videos/${req.user.id}/${videoID}`)

    S3_Service.getSignedURL(`videos/${req.user.id}/${videoID}`)
        .then(data => {
            console.log(data)
            res.status(200).send({
                status: 'success',
                video_link: data
            });
        })
        .catch(err => {
            console.log(err)
            console.log('Could Not Fetch Video From Amazon Bucket');

            res.status(404).send({
                status: 'error',
                message: `Could Not Fetch Video From Amazon Bucket with ID ${videoID}`
            });
        });
});

module.exports = router;
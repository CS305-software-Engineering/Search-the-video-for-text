const express = require('express');
const router = express.Router();

const Auth = require("../middleware/Auth.js")
const jobs = require('../controllers/Jobs/jobs');
const generateSubtitles = require('../controllers/SubsFileGeneration/gen_sub_file');
const S3_Service = require("../controllers/Storage Service/s3_bucket_operations.js")
router.use(Auth.verifyToken)

router.get('/', (req, res) => {
    const jobID =req.headers['jobid'];
	const job = jobs.get(jobID);
	const asSubtitleFile = req.query.output === 'vtt'|| req.query.output === 'srt';

        S3_Service.getSignedURL(`transcripts/${jobID}.vtt`)
        .then(data => {
           // console.log(data)
            res.json(data);
        })
        .catch(err => {
            console.log(jobID)
            console.log(err)
            console.log('Could Not Fetch File From Amazon Bucket');
            this.failed = true;
            res.status(404);
		res.json({
			status : 'error',
			message : `Could not find a job with the ID ${jobID} or the job hasn't finished yet`
		});
           
          
        });
		
        



});

module.exports = router;
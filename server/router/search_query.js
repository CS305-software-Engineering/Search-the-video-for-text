const express = require('express');
const router = express.Router();
const Auth = require("../middleware/Auth.js")
const db = require('../db')
const addSearchQueryToHistory = require('../controllers/History Management/search_history.js').insert_search_into_history
const S3_Service = require("../controllers/Storage Service/s3_bucket_operations.js")

router.use(Auth.verifyToken)


router.post('/', async (req, res) => {

    const sub_id = req.body.sub_id
    const search_text = req.body.search_text

    S3_Service.downloadObject(`transcripts/${sub_id}.vtt`)
        .then(data => {
            var vtt_file = new Buffer(data.Body).toString("utf8");


            var spawn = require("child_process").spawn;
            var search_process = spawn('python3', ["./server/search_service/search_NLP.py", search_text, vtt_file])//"-i./../database/public/uploads/"+req.body.fname ] ); 
            search_process.stdout.on('data', function (data) {

                console.log(data.toString());

                addSearchQueryToHistory(sub_id, search_text).then(
                    val => {
                        console.log(val)
                        res.status(200).send({ 'result': data.toString() })
                    }
                ).catch(
                    error => {
                        console.log(error);
                        res.status(500).send({ status: 'error', reason: error.reason || error })
                    }
                )
            })

            search_process.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
                res.status(500).send({ status: 'error', reason: `stderr: ${data}` })
            });



            //res.json(string_data);
        })
        .catch(err => {
            console.log(jobID)
            console.log(err)
            console.log('Could Not Fetch File From Amazon Bucket');
            this.failed = true;
            res.status(404);
            res.json({
                status: 'error',
                message: `Could not find a job with the ID ${jobID} or the job hasn't finished yet`
            });


        }

        );






});

module.exports = router;
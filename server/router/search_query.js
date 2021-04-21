const express = require('express');
const router = express.Router();
const Auth = require("../middleware/Auth.js")
const db = require('../db')
const addSearchQueryToHistory = require('../controllers/History Management/search_history.js').insert_search_into_history


router.use(Auth.verifyToken)


router.post('/',async (req, res) => {

    const sub_id = req.body.sub_id
    const search_text = req.body.search_text

    var spawn = require("child_process").spawn; 
    var search_process = spawn('python3',["./server/search_service/search_NLP.py", ])//"-i./../database/public/uploads/"+req.body.fname ] ); 
    search_process.stdout.on('data', function(data) {
    
        console.log(data.toString());

        addSearchQueryToHistory(sub_id,search_text).then(
            val => {
                console.log(val)
                res.status(200).send({ 'result' : data})
            }
        ).catch(
            error => {
                console.log(error);
                res.status(500).send({status : 'error', reason : error.reason || error})
            }
        )
    }) 

    search_process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).send({status : 'error', reason : `stderr: ${data}`})
    });

    
});

module.exports = router;
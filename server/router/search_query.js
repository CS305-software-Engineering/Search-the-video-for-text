const express = require('express');
const router = express.Router();
const Auth = require("../middleware/Auth.js")
const db = require('../db')
const addSearchQueryToHistory = require('../controllers/History Management/search_history.js').insert_search_into_history


router.use(Auth.verifyToken)

router.post('/',async (req, res) => {

    const sub_id = req.body.sub_id
    const search_text = req.body.search_text

    addSearchQueryToHistory(sub_id,search_text).then(
        val => {
            console.log(val)
            res.status(200).send({ 'result' : "test123"})
        }
    ).catch(
        error => {
            console.log(error);
            res.status(500).send({status : 'error', reason : error.reason || error})
        }
    )
});

module.exports = router;
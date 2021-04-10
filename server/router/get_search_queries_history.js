const express = require('express');
const router = express.Router();
const Auth = require("../middleware/Auth.js")
const db = require('../db')


router.use(Auth.verifyToken)

router.get('/',async (req, res) => {
    const sub_id = req.body.sub_id
    const myHistory = 'SELECT * FROM search_history WHERE sub_id = ($1)';
    try {
        const { rows } = await db.query(myHistory, [sub_id]);
        console.log(rows)
        res.status(200).send(rows);
      } catch(error) {
        console.log(error)
        res.status(400).send(error);
    }
});

module.exports = router;
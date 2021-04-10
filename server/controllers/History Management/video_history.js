const moment = require('moment');
const db = require('../db');


async function insert_video_into_history(user_id,video_id,sub_id){
    const query = `INSERT INTO user_history(
        video_id, 
        user_id, 
        sub_id, 
        date_created
        ) VALUES ($1, $2, $3, $4) returning *`;
    try{
      const values = [
        video_id, 
        user_id, 
        sub_id, 
        moment(new Date())
    ]
      const {rows} = await db.query(query, values);
      if(!rows[0]){
        return Error('Can Not Add into Video History')
      }
      return true;
    }catch(err){
      return Error(err)
    }
  }

module.exports = {
    insert_video_into_history  
};
const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../db');


async function insert_search_into_history(video_id,search_text){
    const query = `INSERT INTO search_history(
        id,
        video_id, 
        search_text, 
        date_created
        ) VALUES ($1, $2, $3, $4) returning *`;
    try{
      const values = [
        uuid(), 
        video_id, 
        search_text, 
        moment(new Date())
    ]
      const {rows} = await db.query(query, values);
      if(!rows[0]){
        return Error('Can Not Add into Search History')
      }
      return true;
    }catch(err){
      return Error(err)
    }
  }

module.exports = {
    insert_search_into_history  
};
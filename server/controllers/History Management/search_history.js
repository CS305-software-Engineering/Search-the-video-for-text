const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../../db');


async function insert_search_into_history(sub_id,search_text){
    const query = `INSERT INTO search_history(
        id,
        sub_id, 
        search_text, 
        date_created
        ) VALUES ($1, $2, $3, $4) returning *`;
    try{
      const values = [
        uuid(), 
        sub_id, 
        search_text, 
        moment(new Date())
    ]
      const {rows} = await db.query(query, values);
      if(!rows[0]){
        throw Error('Can Not Add into Search History')
      }
      return true;
    }catch(err){
      throw Error(err)
    }
  }

module.exports = {
    insert_search_into_history  
};
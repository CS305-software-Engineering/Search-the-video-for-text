const moment = require('moment');
const { uuid } = require('uuidv4');
const { getMaxListeners } = require('../db');
const db = require('../db');
const Helper = require('./Helper');

const User = {
  /**
   * Create A User
   * @param {object} req 
   * @param {object} res
   * @returns {object} reflection object 
   */
  async create(req, res) {
    
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({'message': 'Some values are missing'});
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    }
    const hashPassword = Helper.hashPassword(req.body.password);

    const createQueryUser = 'INSERT INTO users(id, email, password,created_date, modified_date) VALUES($1, $2, $3, $4, $5) returning *';

    const values = [
      uuid(),
      req.body.email,
      hashPassword,
      moment(new Date()),
      moment(new Date())
    ];

    console.log(values)

    try {
      const { rows } = await db.query(createQueryUser, values);
      const token = Helper.generateToken(rows[0].id);
      return res.status(201).send({ token });
    } catch(error) {
      
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ 'message': 'User with that EMAIL already exist' })
      }
      return res.status(400).send(error);
    }
  },
  /**
   * Login
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object 
   */
  async login(req, res) {

    if (!req.body.email || !req.body.password) {
      return res.status(400).send({'message': 'Some values are missing'});
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    }
    const text = 'SELECT * FROM users WHERE email = ($1)';
    try {
      const { rows } = await db.query(text, [req.body.email]);
      if (!rows[0]) {
        return res.status(400).send({'message': 'The credentials you provided is incorrect'});
      }
      if(!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
      }
      const token = Helper.generateToken(rows[0].id);
      const user_type = rows[0].user_type;
      const id = rows[0].id;
      return res.status(200).send({ token , user_type , id});
    } catch(error) {
      return res.status(400).send(error)
    }
  },
  /**
   * Delete A User
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return status code 204 
   */
  async delete(req, res) {
    const deleteQuery = 'DELETE FROM users WHERE id=($1) returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.user.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'user not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async insert_into_history(req, res){
    const check = 'SELECT * FROM users WHERE id = ($1)';
    const query = 'INSERT INTO search_history(id, date_created, video_link, search_text, transcribed_text) VALUES ($1, $2, $3, $4, $5) returning *';
    try{
      const check_user = await db.query(check, [req.user.id]);
      if(!check_user.rows[0]){
        return res.status(404).send({'message': 'user does not exist.'});
      }
      console.log([req.user.id, moment(new Date()), req.body.video_link, req.body.search_text, req.body.transcript]);
      const {rows} = await db.query(query, [req.user.id, moment(new Date()), req.body.video_link, req.body.search_text, req.body.transcript]);
      console.log(rows);
      if(!rows[0]){
        return res.status(404).send({'message': 'Could not insert into database'});
      }
      return res.status(200).send(rows[0]);
    }catch(error){
      return res.status(400).send(error);
    }
  },

  async get_history(req, res){
    const query = 'SELECT * FROM search_history WHERE id = ($1)';
    try{
      id = req.user.id;
      const {rows} = await db.query(query, [id]);
      return res.status(200).send(rows);
    }catch(error){
      return res.status(400).send(error);
    }
  },

  async see_profile(req, res){
    const query = 'SELECT * FROM users WHERE id = ($1)';
    try{
      id = req.user.id;
      const {rows} = await db.query(query, [id]);
      if(!rows[0]){
        return res.status(400).send({'message' : 'Could not find profile'});
      }
      return res.status(200).send(rows[0]);
    }catch(error){
      return res.status(400).send(error);
    }
  },

  async update_password(req, res){
    const query = 'UPDATE users SET password = ($1), modified_date = ($2) WHERE id = ($3)';
    const hashPassword = Helper.hashPassword(req.body.password);
    try{  
      const param = [hashPassword, moment(new Date()), req.user.id];
      const {rows} = await db.query(query, param);
      if(!rows[0]){
        return res.status(400).send({'message' : 'Could not update profile'});
      }
      return res.status(200).send(rows);
    }catch(error){
      return res.status(400).send(error);
    }
  }
}


module.exports = User;
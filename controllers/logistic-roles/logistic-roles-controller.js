// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

//exporting the data base configs
const dataBase = require('../../data-base-config/db-config');

const bodyParser = require('body-parser');
const { Pool } = require('pg');

const port = dataBase.dbAppPort;

//Configurating the db connection
const pool = new Pool(dataBase.dbConfig);

exports.getAll = async (req, res) =>{
  const result = await pool.query('SELECT * FROM logistic_roles');
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find logistic roles.' });
  }
  res.json(result.rows);
}

exports.getOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM logistic_roles WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find logistic role.' });
  }
  res.json(result.rows[0]);
}

exports.postOne = async (req, res) =>{
  const request = req.body;
  const errors = [];

  if(request.length > 1 || request.length === 1){
    for(const register of request){
      if(!register.logistic_type || !register.state){
          errors.push({ error: 'Failed to register logistic roles.'});
      }
    }
    if(errors.length > 0){
      return res.status(400).json(errors);
    }
    const promises = request.map(async (register) => {
      const result = await pool.query('INSERT INTO logistic_roles (logistic_type, state) VALUES ($1, $2) RETURNING *', [register.logistic_type, register.state]);
      return result.rows[0];
    });
    try{
      const insertedLocalities = await Promise.all(promises);

      if(insertedLocalities.length === 0){
          return res.status(404).json({ error: 'Failed to register logistic role.'});
      }
       res.json(insertedLocalities);
    }catch(error){
      console.error('Error inserting license plates:', error);
      res.status(500).json({error: 'Internal server error.'})
    }
  }else{
    if(!request.logistic_type || !request.state){
        errors.push({ error: 'Failed to register logistic role.'});
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    const result = await pool.query('INSERT INTO logistic_roles (logistic_type, state) VALUES ($1, $2) RETURNING *', [request.logistic_type, request.state]);
    if(result.rows.length === 0){
        return res.status(404).json({ error: 'Failed to register logistic role.'});
    }
    res.json(result.rows[0]);
  }
}

exports.updateOne = async (req, res) =>{
  if(!req.body.logistic_type || !req.body.state){
        return res.status(404).json({ error: 'Failed to update logistic role.' });
  }
  const { id } = req.params;
  const { logistic_type, state } = req.body;
  const result = await pool.query('UPDATE logistic_roles SET logistic_type = $1, state = $2 WHERE id = $3 RETURNING *', [logistic_type, state, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find logistic role.' });
  }
  res.json(result.rows[0]);
}

exports.deleteOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('DELETE FROM logistic_roles WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find logistic role.' });
  }
  res.json({ message: 'Logistic role successfully deleted.' });
}

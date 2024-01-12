// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

//exporting the data base configs
const dataBase = require('../../data-base-config/db-config');

const bodyParser = require('body-parser');
const { Pool } = require('pg');

const port = dataBase.dbAppPort;

//Configurating the db connection
const pool = new Pool(dataBase.dbConfig);

exports.getAll = async (req, res) =>{
  const result = await pool.query('SELECT * FROM driver');
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find driver.' });
  }
  res.json(result.rows);
}

exports.getOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM driver WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find driver.' });
  }
  res.json(result.rows[0]);
}

exports.postOne = async (req, res) =>{
  const request = req.body;
  const errors = [];

  if(request.length > 1 || request.length === 1){
    for(const register of request){
      if(!register.cpf || !register.name || !register.contact || !register.state){
          errors.push({ error: 'Failed to register driver.'});
      }
    }
    if(errors.length > 0){
      return res.status(400).json(errors);
    }
    const promises = request.map(async (register) => {
      const result = await pool.query('INSERT INTO driver (cpf, name, contact, state) VALUES ($1, $2, $3, $4) RETURNING *', [register.cpf, register.name, register.contact, register.state]);
      return result.rows[0];
    });
    try{
      const insertedLocalities = await Promise.all(promises);

      if(insertedLocalities.length === 0){
          return res.status(404).json({ error: 'Failed to register driver.'});
      }
       res.json(insertedLocalities);
    }catch(error){
      console.error('Error inserting drivers:', error);
      res.status(500).json({error: 'Internal server error.'})
    }
  }else{
    if(!request.cpf || !request.name || !request.contact || !request.state){
        errors.push({ error: 'Failed to register driver.'});
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    const result = await pool.query('INSERT INTO driver (cpf, name, contact, state) VALUES ($1, $2, $3, $4) RETURNING *', [request.cpf, request.name, request.contact, request.state]);
    if(result.rows.length === 0){
        return res.status(404).json({ error: 'Failed to register driver.'});
    }
    res.json(result.rows[0]);
  }
}

exports.updateOne = async (req, res) =>{
  if(!req.body.cpf || !req.body.name || !req.body.contact || !req.body.state){
        return res.status(404).json({ error: 'Failed to update driver.' });
  }
  const { id } = req.params;
  const { cpf, name, contact, state } = req.body;
  const result = await pool.query('UPDATE driver SET cpf = $1, name = $2, contact = $3, state = $4 WHERE id = $5 RETURNING *', [cpf, name, contact, state, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find driver.' });
  }
  res.json(result.rows[0]);
}

exports.deleteOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('DELETE FROM driver WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find driver.' });
  }
  res.json({ message: 'Driver successfully deleted.' });
}

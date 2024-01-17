// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

//exporting the data base configs
const dataBase = require('../../data-base-config/db-config');

const bodyParser = require('body-parser');
const { Pool } = require('pg');

const port = dataBase.dbAppPort;

//Configurating the db connection
const pool = new Pool(dataBase.dbConfig);

exports.getAll = async (req, res) =>{
  const result = await pool.query('SELECT * FROM carrier');
   if (result.rows.length === 0) {
     return res.status(404).json({ error: 'Cannot find carriers.' });
   }
  res.json(result.rows);
}

exports.getOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM carrier WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find carrier.' });
  }
  res.json(result.rows[0]);
}

exports.postOne = async (req, res) =>{
  const request = req.body;
  const errors = [];

  if(request.length > 1 || request.length === 1){
    for(const register of request){
      if(!register.fleet_id || !register.uf_id || !register.cnpj || !register.name || !register.contact || !register.state){
          errors.push({ error: 'Failed to register carrier.'});
      }
    }
    if(errors.length > 0){
      return res.status(400).json(errors);
    }
    const promises = request.map(async (register) => {
      const result = await pool.query('INSERT INTO carrier (fleet_id, uf_id, cnpj, name, contact, state) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [register.fleet_id, register.uf_id, register.cnpj, register.name, register.contact, register.state]);
      return result.rows[0];
    });
    try{
      const insertedCarriers = await Promise.all(promises);
      if(insertedCarriers.length === 0){
          return res.status(404).json({ error: 'Failed to register carrier.'});
      }
      res.json(insertedCarriers);
    }catch(error){
      console.error('Error inserting carriers:', error);
      res.status(500).json({error: 'Internal server error.'})
    }
  }else{
    if(!request.fleet_id || !request.uf_id || !request.cnpj || !request.name || !request.contact || !request.state){
        errors.push({ error: 'Failed to register carrier.'});
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    const result = await pool.query('INSERT INTO carrier (fleet_id, uf_id, cnpj, name, contact, state) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [request.fleet_id, request.uf_id, request.cnpj, request.name, request.contact, request.state]);
    if(result.rows.length === 0){
        return res.status(404).json({ error: 'Failed to register carrier.'});
    }
    res.json(result.rows[0]);
  }
}

exports.updateOne = async (req, res) =>{
  if(!req.body.fleet_id || !req.body.uf_id || !req.body.cnpj || !req.body.name || !req.body.contact || !req.body.state){
    return res.status(404).json({ error: 'Failed to update carrier.' });
  }
  const { id } = req.params;
  const { fleet_id, uf_id, cnpj, name, contact, state } = req.body;
  const result = await pool.query('UPDATE carrier SET fleet_id = $1, uf_id = $2, cnpj = $3, name = $4, contact = $5, state = $6  WHERE id = $7 RETURNING *', [fleet_id, uf_id, cnpj, name, contact, state, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find carrier.' });
  }
  res.json(result.rows[0]);
}

exports.deleteOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('DELETE FROM carrier WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find carrier.' });
  }
  res.json({ message: 'Carrier successfully deleted.' });
}

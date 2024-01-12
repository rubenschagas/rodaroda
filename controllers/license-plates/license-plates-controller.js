// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

//exporting the data base configs
const dataBase = require('../../data-base-config/db-config');

const bodyParser = require('body-parser');
const { Pool } = require('pg');

const port = dataBase.dbAppPort;

//Configurating the db connection
const pool = new Pool(dataBase.dbConfig);

exports.getAll = async (req, res) =>{
  const result = await pool.query('SELECT * FROM license_plate');
   if (result.rows.length === 0) {
     return res.status(404).json({ error: 'Cannot find license plates.' });
   }
  res.json(result.rows);
}

exports.getOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM license_plate WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find license plate.' });
  }
  res.json(result.rows[0]);
}

exports.postOne = async (req, res) =>{
  const request = req.body;
  const errors = [];

  if(request.length > 1 || request.length === 1){
    for(const register of request){
      if(!register.license_plate || !register.state){
          errors.push({ error: 'Failed to register license plate.'});
      }
    }
    if(errors.length > 0){
      return res.status(400).json(errors);
    }
    const promises = request.map(async (register) => {
      const result = await pool.query('INSERT INTO license_plate (license_plate, state) VALUES ($1, $2) RETURNING *', [register.license_plate, register.state]);
      return result.rows[0];
    });
    try{
      const insertedLicensePlates = await Promise.all(promises);
      if(insertedLicensePlates.length === 0){
          return res.status(404).json({ error: 'Failed to register license plate.'});
      }
      res.json(insertedLicensePlates);
    }catch(error){
      console.error('Error inserting license plates:', error);
      res.status(500).json({error: 'Internal server error.'})
    }
  }else{
    if(!request.license_plate || !request.state){
        errors.push({ error: 'Failed to register license plate.'});
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    const result = await pool.query('INSERT INTO license_plate (license_plate, state) VALUES ($1, $2) RETURNING *', [request.license_plate, request.state]);
    if(result.rows.length === 0){
        return res.status(404).json({ error: 'Failed to register license plate.'});
    }
    res.json(result.rows[0]);
  }
}

exports.updateOne = async (req, res) =>{
  if(!req.body.license_plate || !req.body.state){
    return res.status(404).json({ error: 'Failed to update license plate.' });
  }
  const { id } = req.params;
  const { license_plate, state } = req.body;
  const result = await pool.query('UPDATE license_plate SET license_plate = $1, state = $2  WHERE id = $3 RETURNING *', [license_plate, state, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find license plate.' });
  }
  res.json(result.rows[0]);
}

exports.deleteOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('DELETE FROM license_plate WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find license plate.' });
  }
  res.json({ message: 'License plate successfully deleted.' });
}

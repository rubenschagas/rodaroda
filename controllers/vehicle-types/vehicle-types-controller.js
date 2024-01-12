// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

//exporting the data base configs
const dataBase = require('../../data-base-config/db-config');

const bodyParser = require('body-parser');
const { Pool } = require('pg');

const port = dataBase.dbAppPort;

//Configurating the db connection
const pool = new Pool(dataBase.dbConfig);

exports.getAll = async (req, res) =>{
  const result = await pool.query('SELECT * FROM vehicle_type');
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find vehicle types.' });
  }
  res.json(result.rows);
}

exports.getOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM vehicle_type WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find vehicle type.' });
  }
  res.json(result.rows[0]);
}

exports.postOne = async (req, res) =>{
  const request = req.body;
  const errors = [];

  if(request.length > 1 || request.length === 1){
    for(const register of request){
      if(!register.vehicle_type || !register.state){
          errors.push({ error: 'Failed to register vehicle type.'});
      }
    }
    if(errors.length > 0){
      return res.status(400).json(errors);
    }
    const promises = request.map(async (register) => {
      const result = await pool.query('INSERT INTO vehicle_type (vehicle_type, state) VALUES ($1, $2) RETURNING *', [register.vehicle_type, register.state]);
      return result.rows[0];
    });
    try{
      const insertedLocalities = await Promise.all(promises);

      if(insertedLocalities.length === 0){
          return res.status(404).json({ error: 'Failed to register vehicle type.'});
      }
       res.json(insertedLocalities);
    }catch(error){
      console.error('Error inserting vehicle types:', error);
      res.status(500).json({error: 'Internal server error.'})
    }
  }else{
    if(!request.vehicle_type || !request.state){
        errors.push({ error: 'Failed to register vehicle type.'});
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    const result = await pool.query('INSERT INTO vehicle_type (vehicle_type, state) VALUES ($1, $2) RETURNING *', [request.vehicle_type, request.state]);
    if(result.rows.length === 0){
        return res.status(404).json({ error: 'Failed to register vehicle type.'});
    }
    res.json(result.rows[0]);
  }
}

exports.updateOne = async (req, res) =>{
  if(!req.body.vehicle_type || !req.body.state){
        return res.status(404).json({ error: 'Failed to update vehicle type.' });
  }
  const { id } = req.params;
  const result = await pool.query('DELETE FROM vehicle_type WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find vehicle type.' });
  }
  res.json({ message: 'Vehicle type successfully deleted.' });
}

exports.deleteOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('DELETE FROM vehicle_type WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find vehicle type.' });
  }
  res.json({ message: 'Vehicle type successfully deleted.' });
}

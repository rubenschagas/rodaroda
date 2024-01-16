// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

//exporting the data base configs
const dataBase = require('../../data-base-config/db-config');

const bodyParser = require('body-parser');
const { Pool } = require('pg');

const port = dataBase.dbAppPort;

//Configurating the db connection
const pool = new Pool(dataBase.dbConfig);

exports.getAll = async (req, res) =>{
  const result = await pool.query('SELECT * FROM vehicle_fleet');
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find vehicle fleets.' });
  }
  res.json(result.rows);
}

exports.getOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM vehicle_fleet WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find vehicle fleet.' });
  }
  res.json(result.rows[0]);
}

exports.postOne = async (req, res) =>{
  const request = req.body;
  const errors = [];

  if(request.length > 1 || request.length === 1){
    for(const register of request){
      if(!register.vehicle_type || !register.state){
          errors.push({ error: 'Failed to register vehicle fleet.'});
      }
    }
    if(errors.length > 0){
      return res.status(400).json(errors);
    }
    const promises = request.map(async (register) => {
      const result = await pool.query('INSERT INTO vehicle_fleet (fleet_name, state) VALUES ($1, $2) RETURNING *', [register.fleet_name, register.state]);
      return result.rows[0];
    });
    try{
      const insertedLocalities = await Promise.all(promises);

      if(insertedLocalities.length === 0){
          return res.status(404).json({ error: 'Failed to register vehicle fleet.'});
      }
       res.json(insertedLocalities);
    }catch(error){
      console.error('Error inserting vehicle fleets:', error);
      res.status(500).json({error: 'Internal server error.'})
    }
  }else{
    if(!request.fleet_name || !request.state){
        errors.push({ error: 'Failed to register vehicle fleet.'});
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    const result = await pool.query('INSERT INTO vehicle_fleet (vehicle_type, state) VALUES ($1, $2) RETURNING *', [request.fleet_name, request.state]);
    if(result.rows.length === 0){
        return res.status(404).json({ error: 'Failed to register vehicle fleet.'});
    }
    res.json(result.rows[0]);
  }
}

exports.updateOne = async (req, res) =>{
  if(!req.body.fleet_name || !req.body.state){
        return res.status(404).json({ error: 'Failed to update vehicle fleet.' });
  }
  const { id } = req.params;
  const { fleet_name, state } = req.body;
  const result = await pool.query('UPDATE vehicle_fleet SET vehicle_type = $1, state = $2 WHERE id = $3 RETURNING *', [fleet_name, state, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find vehicle fleet.' });
  }
  res.json(result.rows[0]);
}

exports.deleteOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('DELETE FROM vehicle_type WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find vehicle type.' });
  }
  res.json({ message: 'Vehicle type successfully deleted.' });
}

// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

//exporting the data base configs
const dataBase = require('../../data-base-config/db-config');

const bodyParser = require('body-parser');
const { Pool } = require('pg');

const port = dataBase.dbAppPort;

//Configurating the db connection
const pool = new Pool(dataBase.dbConfig);

exports.getAll = async (req, res) =>{
  const result = await pool.query('SELECT * FROM vehicle');
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find vehicles.' });
  }
  res.json(result.rows);
}

exports.getOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM vehicle WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find vehicle.' });
  }
  res.json(result.rows[0]);
}

exports.postOne = async (req, res) =>{
  const request = req.body;
  const errors = [];

  if(request.length > 1){
    for(const register of request){
      if(!register.vehicle_license_plate_id || !register.vehicle_type_id || !register.vehicle_fleet_id || !register.document_number || !register.model || !register.state){
          errors.push({ error: 'Failed to register vehicle.'});
      }
    }
    if(errors.length > 0){
      return res.status(400).json(errors);
    }
    const promises = request.map(async (register) => {
      const result = await pool.query('INSERT INTO vehicle (vehicle_license_plate_id, vehicle_type_id, vehicle_fleet_id, document_number, model, state) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',  [register.vehicle_license_plate_id, register.vehicle_type_id, register.fleet_id, register.document_number, register.model, register.state]);
      return result.rows[0];
    });
    try{
      const insertedVehicles = await Promise.all(promises)
      if(insertedVehicles.length === 0){
          return res.status(404).json({ error: 'Failed to register vehicle.'});
      }
      res.json(insertedVehicles);
    }catch(error){
      console.error('Error inserting vehicles:', error);
      res.status(500).json({error: 'Internal server error.'})
    }
  }else{
    if(!request.vehicle_license_plate_id || !request.vehicle_type_id || !request.vehicle_fleet_id || !request.document_number || !request.model || !request.state){
       errors.push({ error: 'Failed to register vehicle.'});
  }
  if(errors.length > 0){
    return res.status(400).json(errors);
  }
  const result = await pool.query('INSERT INTO vehicle (vehicle_license_plate_id, vehicle_type_id, vehicle_fleet_id, document_number, model, state) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',  [request.vehicle_license_plate_id, request.vehicle_type_id, request.fleet_id, request.document_number, request.model, request.state]);
  if(result.rows.length === 0){
    return res.status(404).json({ error: 'Failed to register vehicle.'});
  }
  res.json(result.rows[0]);
  }
}

exports.updateOne = async (req, res) =>{
  if(!req.body.vehicle_license_plate_id || !req.body.vehicle_type_id || !req.body.vehicle_fleet_id || !req.body.document_number || !req.body.model || !req.body.state){
    return res.status(404).json({ error: 'Failed to update vehicle.' });
  }
  const { id } = req.params;
  const { name, model, license_plate } = req.body;
  const result = await pool.query('UPDATE vehicle SET vehicle_license_plate_id = $1, vehicle_type_id = $2, vehicle_fleet_id = $3, document_number = $4, model = $5, state = $6 WHERE id = $7 RETURNING *', [vehicle_license_plate_id, vehicle_type_id, vehicle_fleet_id, document_number, model, state, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find vehicle.' });
  }
  res.json(result.rows[0]);
}

exports.deleteOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('DELETE FROM vehicle WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find vehicle.' });
  }
  res.json({ message: 'Vehicle successfully deleted.' });
}

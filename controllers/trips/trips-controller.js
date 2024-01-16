// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

//exporting the data base configs
const dataBase = require('../../data-base-config/db-config');

const bodyParser = require('body-parser');
const { Pool } = require('pg');

const port = dataBase.dbAppPort;

//Configurating the db connection
const pool = new Pool(dataBase.dbConfig);

exports.getAll = async (req, res) =>{
  const result = await pool.query('SELECT * FROM trip');
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find trips.' });
  }
  res.json(result.rows);
}

exports.getOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM trip WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find trip.' });
  }
  res.json(result.rows[0]);
}

exports.postOne = async (req, res) =>{
  const request = req.body;
  const errors = [];

  if(request.length > 1 || request.length === 1){
  for(const register of request){
    if(!register.origin_id || !register.destination_id || !register.product_id || !register.carrier_id || !register.vehicle_id || !register.driver_id || !register.leaving_date || !register.arrival_date || !register.status){
          errors.push({ error: 'Failed to register trip.'});
    }
  }
  if(errors.length > 0){
    return res.status(400).json(errors);
  }
  const promises = request.map(async (register) => {
    const result = await pool.query('INSERT INTO trip (origin_id, destination_id, product_id, carrier_id, vehicle_id, driver_id, leaving_date, arrival_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [register.origin_id, register.destination_id, register.product_id, register.carrier_id, register.vehicle_id, register.driver_id, register.leaving_date, register.arrival_date, register.status]);
    return result.rows[0];
  });
  try{
    const insertedTrips = await Promise.all(promises)
    if(insertedTrips.length === 0){
        return res.status(404).json({ error: 'Failed to register trip.'});
    }
    res.json(insertedTrips);
  }catch(error){
    console.error('Error inserting trips:', error);
    res.status(500).json({error: 'Internal server error.'})
  }
  }else{
    if(!request.origin_id || !request.destination_id || !request.product_id || !request.carrier_id || !request.vehicle_id || !request.driver_id || !request.leaving_date || !request.arrival_date || !request.status){
       errors.push({ error: 'Failed to register trip.'});
  }
  if(errors.length > 0){
    return res.status(400).json(errors);
  }
  const result = await pool.query('INSERT INTO trip (origin_id, destination_id, product_id, carrier_id, vehicle_id, driver_id, leaving_date, arrival_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
  [request.origin_id, request.destination_id, request.product_id, request.carrier_id, request.vehicle_id, request.driver_id, request.leaving_date, request.arrival_date, request.status]);
  if(result.rows.length === 0){
    return res.status(404).json({ error: 'Failed to register trip.'});
  }
  res.json(result.rows[0]);
  }
}

exports.updateOne = async (req, res) =>{
  if(!req.body.origin_id || !req.body.destination_id_id || !req.body.product_id || !req.body.carrier_id || !req.body.vehicle_id || !req.body.driver_id || !req.body.leaving_date || !req.body.arrival_date || !req.body.status){
    return res.status(404).json({ error: 'Failed to register trip.' });
  }
  const { id } = req.params;
  const { origin_id, destination_id, product_id, carrier_idr, vehicle_id, driver_id, leaving_date, arrival_date, status } = req.body;
  const result = await pool.query('UPDATE trip SET origin_id = $1, destination_id = $2, product_id = $3, carrier_id = $4, vehicle_id = $5, driver_id = $6 leaving_date = $7, arrival_date = $8, status = $9  WHERE id = $10 RETURNING *',
  [origin_id, destination_id, product_id, carrier_idr, vehicle_id, driver_id, leaving_date, arrival_date, status]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find trip.' });
  }
  res.json(result.rows[0]);
}

exports.deleteOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('DELETE FROM trip WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find trip.' });
  }
  res.json({ message: 'Trip successfully deleted.' });
}

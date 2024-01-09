// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const applicationPort = process.env.APPLICATION_PORT || '3000';
const databaseHostname = process.env.DATABASE_HOSTNAME || 'localhost';
const databasePort = process.env.DATABASE_PORT || '5432';
const databaseName = process.env.DATABASE_NAME || 'rodaroda';
const databaseUsername = process.env.DATABASE_USER || 'postgres';
const databasePassword = process.env.DATABASE_PASSWORD || 'postgres';

const app = express();
const port = applicationPort;

app.use(bodyParser.json());

// Configuração do pool de conexão com o PostgreSQL
const pool = new Pool({
  host: databaseHostname,
  port: databasePort,
  database: databaseName,
  user: databaseUsername,
  password: databasePassword,
});

// CRUD para localidade
app.get('/localities', async (req, res) => {
  const result = await pool.query('SELECT * FROM locality');
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find localities.' });
  }
  res.json(result.rows);
});

app.post('/localities', async (req, res) => {
  const request = req.body;
  const errors = [];

  if(request.length > 1){
    for(const register of request){
      if(!register.uf_id || !register.logistic_type_id || !register.cnpj || !register.name || !register.type || !register.state){
          errors.push({ error: 'Failed to register locality.'});
      }
    }
    if(errors.length > 0){
      return res.status(400).json(errors);
    }
    const promises = request.map(async (register) => {
      const result = await pool.query('INSERT INTO locality (uf_id, logistic_type_id, cnpj, name, type, state) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [register.uf_id, register.logistic_type_id, register.cnpj, register.name, register.type, register.state]);
      return result.rows[0];
    });
    try{
      const insertedLocalities = await Promise.all(promises);

      if(insertedLocalities.length === 0){
          return res.status(404).json({ error: 'Failed to register locality.'});
      }
       res.json(insertedLocalities);
    }catch(error){
      console.error('Error inserting localities:', error);
      res.status(500).json({error: 'Internal server error.'})
    }
  }else{
    if(!request.uf_id || !request.logistic_type_id || !request.cnpj || !request.name || !request.type || !request.state){
        errors.push({ error: 'Failed to register locality.'});
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    const result = await pool.query('INSERT INTO locality (uf_id, logistic_type_id, cnpj, name, type, state) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [register.uf_id, register.logistic_type_id, register.cnpj, register.name, register.type, register.state]);
    if(result.rows.length === 0){
        return res.status(404).json({ error: 'Failed to register locality.'});
    }
    res.json(result.rows[0]);
  }
});

app.get('/localities/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM locality WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find locality.' });
  }
  res.json(result.rows[0]);
});

app.put('/localities/:id', async (req, res) => {
  if(!req.body.uf_id || !req.body.logistic_type_id || !req.body.cnpj || !req.body.name || !req.body.type || !req.body.state){
        return res.status(404).json({ error: 'Failed to update locality.' });
  }
  const { id } = req.params;
  const { uf_id, logistic_type_id, cnpj, name, type, state } = req.body;
  const result = await pool.query('UPDATE locality SET uf_id = $1, logistic_type_id = $2, cnpj = $3, name = $4, type = $5, state = $6 WHERE id = $7 RETURNING *', [uf_id, logistic_type_id, cnpj, name, type, state, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find locality.' });
  }
  res.json(result.rows[0]);
});

app.delete('/localities/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM locality WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find locality.' });
  }
  res.json({ message: 'Locality successfully deleted.' });
});

// CRUD para produto
app.get('/products', async (req, res) => {
  const result = await pool.query('SELECT * FROM product');
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find products.' });
  }
  res.json(result.rows);
});

app.post('/products', async (req, res) => {
  const request = req.body;
  const errors = [];

  if(request.length > 1){
    for(const register of request){
        if(!register.product_category_id || !register.name || !register.description || !register.state){
            errors.push({ error: 'Failed to register product.'});
        }
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    const promises = request.map(async (register) => {
        const result = await pool.query('INSERT INTO product (product_category_id, name, description, state) VALUES ($1, $2, $3, $4) RETURNING *',  [register.product_category_id, register.name, register.description, register.state]);
        return result.rows[0];
    });
    try{
      const insertedProducts = await Promise.all(promises)
      if(insertedProducts.length === 0){
        return res.status(404).json({ error: 'Failed to register product.'});
      }
        res.json(insertedProducts);
      }catch(error){
        console.error('Error inserting products:', error);
        res.status(500).json({error: 'Internal server error.'})
      }
  }else{
    if(!request.product_category_id || !request.name || !request.description || !request.state){
        errors.push({ error: 'Failed to register product.'});
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    const result = await pool.query('INSERT INTO product (product_category_id, name, description, state) VALUES ($1, $2, $3, $4) RETURNING *',  [request.product_category_id, request.name, request.description, request.state]);
    if(result.rows.length === 0){
        return res.status(404).json({ error: 'Failed to register product.'});
    }
    res.json(result.rows[0]);
  }
});

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM product WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find product.' });
  }
  res.json(result.rows[0]);
});

app.put('/products/:id', async (req, res) => {
  if(!req.body.product_category_id || !req.body.name || !req.body.description || !req.body.state){
    return res.status(404).json({ error: 'Failed to update product.' });
  }
  const { id } = req.params;
  const { name, description } = req.body;
  const result = await pool.query('UPDATE product SET product_category_id = $1, name = $2, description = $3, state = $4 WHERE id = $5 RETURNING *', [product_category_id, name, description, state, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find product.' });
  }
  res.json(result.rows[0]);
});

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM product WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find product.' });
  }
  res.json({ message: 'Product successfully deleted.' });
});

// CRUD para transportadora
app.get('/carriers', async (req, res) => {
  const result = await pool.query('SELECT * FROM carrier');
   if (result.rows.length === 0) {
     return res.status(404).json({ error: 'Cannot find carriers.' });
   }
  res.json(result.rows);
});

app.post('/carriers', async (req, res) => {
  const request = req.body;
  const errors = [];

  if(request.length > 1){
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
});

app.get('/carriers/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM carrier WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find carrier.' });
  }
  res.json(result.rows[0]);
});

app.put('/carriers/:id', async (req, res) => {
  if(!req.body.fleet_id || !req.body.uf_id || !req.body.cnpj || !req.body.name || !req.body.contact || !req.body.state){
    return res.status(404).json({ error: 'Failed to update carrier.' });
  }
  const { id } = req.params;
  const { name, contact } = req.body;
  const result = await pool.query('UPDATE carrier SET fleet_id = $1, uf_id = $2, cnpj = $3, name = $4, contact = $5, state = $6  WHERE id = $7 RETURNING *', [fleet_id, uf_id, cnpj, name, contact, state, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find carrier.' });
  }
  res.json(result.rows[0]);
});

app.delete('/carriers/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM carrier WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find carrier.' });
  }
  res.json({ message: 'Carrier successfully deleted.' });
});

// CRUD para veículo
app.get('/vehicles', async (req, res) => {
  const result = await pool.query('SELECT * FROM vehicle');
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find vehicles.' });
  }
  res.json(result.rows);
});

app.post('/vehicles', async (req, res) => {
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
});

app.get('/vehicles/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM vehicle WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find vehicle.' });
  }
  res.json(result.rows[0]);
});

app.put('/vehicles/:id', async (req, res) => {
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
});

app.delete('/vehicles/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM vehicle WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find vehicle.' });
  }
  res.json({ message: 'Vehicle successfully deleted.' });
});

// CRUD para viagem
app.get('/trips', async (req, res) => {
  const result = await pool.query('SELECT * FROM trip');
  if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cannot find trips.' });
  }
  res.json(result.rows);
});

app.post('/trips', async (req, res) => {
  const request = req.body;
  const errors = [];

  if(request.length > 1){
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
});

app.get('/trips/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM trip WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find trip.' });
  }
  res.json(result.rows[0]);
});

app.put('/trips/:id', async (req, res) => {
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
});

app.delete('/trips/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM trip WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find trip.' });
  }
  res.json({ message: 'Trip successfully deleted.' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

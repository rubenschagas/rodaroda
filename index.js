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
      if(!register.name || !register.type){
          errors.push({ error: 'Failed to register locality.'});
      }
    }
    if(errors.length > 0){
      return res.status(400).json(errors);
    }
    const promises = request.map(async (register) => {
      const result = await pool.query('INSERT INTO locality (name, type) VALUES ($1, $2) RETURNING *', [register.name, register.type]);
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
    if(!request.name || !request.type){
        errors.push({ error: 'Failed to register locality.'});
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    const result = await pool.query('INSERT INTO locality (name, type) VALUES ($1, $2) RETURNING *', [request.name, request.type]);
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
  if(!req.body.name || !req.body.type){
        return res.status(404).json({ error: 'Failed to update locality.' });
  }
  const { id } = req.params;
  const { name, type } = req.body;
  const result = await pool.query('UPDATE locality SET name = $1, type = $2 WHERE id = $3 RETURNING *', [name, type, id]);
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
        if(!register.name || !register.description){
            errors.push({ error: 'Failed to register product.'});
        }
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    const promises = request.map(async (register) => {
        const result = await pool.query('INSERT INTO product (name, description) VALUES ($1, $2) RETURNING *',  [register.name, register.description]);
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
    if(!request.name || !request.description){
        errors.push({ error: 'Failed to register product.'});
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    const result = await pool.query('INSERT INTO product (name, description) VALUES ($1, $2, $3) RETURNING *',  [request.name, request.description]);
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
  if(!req.body.name || !req.body.description){
    return res.status(404).json({ error: 'Failed to update product.' });
  }
  const { id } = req.params;
  const { name, description } = req.body;
  const result = await pool.query('UPDATE product SET name = $1, description = $2 WHERE id = $3 RETURNING *', [name, description, id]);
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
      if(!register.name || !register.contact){
          errors.push({ error: 'Failed to register carrier.'});
      }
    }
    if(errors.length > 0){
      return res.status(400).json(errors);
    }
    const promises = request.map(async (register) => {
      const result = await pool.query('INSERT INTO carrier (name, contact) VALUES ($1, $2) RETURNING *', [register.name, register.contact]);
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
    if(!request.name || !request.contact){
        errors.push({ error: 'Failed to register carrier.'});
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    const result = await pool.query('INSERT INTO carrier (name, contact) VALUES ($1, $2) RETURNING *', [request.name, request.contact]);
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
  if(!req.body.name || !req.body.contact){
    return res.status(404).json({ error: 'Failed to update carrier.' });
  }
  const { id } = req.params;
  const { name, contact } = req.body;
  const result = await pool.query('UPDATE carrier SET name = $1, contact = $2 WHERE id = $3 RETURNING *', [name, contact, id]);
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
      if(!register.name || !register.model || !register.license_plate){
          errors.push({ error: 'Failed to register vehicle.'});
      }
    }
    if(errors.length > 0){
      return res.status(400).json(errors);
    }
    const promises = request.map(async (register) => {
      const result = await pool.query('INSERT INTO vehicle (name, model, license_plate) VALUES ($1, $2, $3) RETURNING *',  [register.name, register.model, register.license_plate]);
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
    if(!request.name || !request.model || !request.license_plate){
       errors.push({ error: 'Failed to register vehicle.'});
  }
  if(errors.length > 0){
    return res.status(400).json(errors);
  }
  const result = await pool.query('INSERT INTO vehicle (name, model, license_plate) VALUES ($1, $2, $3) RETURNING *',  [request.name, request.model, request.license_plate]);
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
  if(!req.body.name || !req.body.model || !req.body.license_plate){
    return res.status(404).json({ error: 'Failed to update vehicle.' });
  }
  const { id } = req.params;
  const { name, model, license_plate } = req.body;
  const result = await pool.query('UPDATE vehicle SET name = $1, model = $2, license_plate = $3 WHERE id = $4 RETURNING *', [name, model, license_plate, id]);
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
  if(!req.body.origin_id || !req.body.destination_id || !req.body.product_id || !req.body.carrier_id || !req.body.vehicle_id || !req.body.leaving_date || !req.body.arrival_date){
      return res.status(404).json({ error: 'Failed to register trip.' });
  }
  const { origin_id, destination_id, product_id, carrier_id, vehicle_id, leaving_date, arrival_date } = req.body;
  const result = await pool.query('INSERT INTO trip (origin_id, destination_id, product_id, carrier_id, vehicle_id, leaving_date, arrival_Date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
  [origin_id, destination_id, product_id, carrier_id, vehicle_id, leaving_date, arrival_date]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Failed to register trip.' });
    }
  res.json(result.rows[0]);
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
  if(!req.body.origin_id || !req.body.destination_id_id || !req.body.product_id || !req.body.carrier_id || !req.body.vehicle_id || !req.body.leaving_date || !req.body.arrival_date){
    return res.status(404).json({ error: 'Failed to register trip.' });
  }
  const { id } = req.params;
  const { origin_id, destination_id, product_id, carrier_idr, vehicle_id, leaving_date, arrival_date } = req.body;
  const result = await pool.query('UPDATE viagem SET origem_id = $1, destino_id = $2, produto_id = $3, transportadora_id = $4, veiculo_id = $5, data_partida = $6, data_chegada = $7  WHERE id = $8 RETURNING *',
  [origin_id, destination_id, product_id, carrier_idr, vehicle_id, leaving_date, arrival_date]);
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

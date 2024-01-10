// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

//exporting the data base configs
const dataBase = require('../../data-base-config/db-config');

const bodyParser = require('body-parser');
const { Pool } = require('pg');

const port = dataBase.dbAppPort;

//Configurating the db connection
const pool = new Pool(dataBase.dbConfig);

exports.getAll = async (req, res) =>{
  const result = await pool.query('SELECT * FROM product_categories');
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find product categories.' });
  }
  res.json(result.rows);
}

exports.getOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM product_categories WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find product category' });
  }
  res.json(result.rows[0]);
}

exports.postOne = async (req, res) =>{
  const request = req.body;
  const errors = [];

  if(request.length > 1){
    for(const register of request){
      if(!register.category || !register.state){
          errors.push({ error: 'Failed to register vehicle type.'});
      }
    }
    if(errors.length > 0){
      return res.status(400).json(errors);
    }
    const promises = request.map(async (register) => {
      const result = await pool.query('INSERT INTO product_categories (category, state) VALUES ($1, $2) RETURNING *', [register.category, register.state]);
      return result.rows[0];
    });
    try{
      const insertedLocalities = await Promise.all(promises);

      if(insertedLocalities.length === 0){
          return res.status(404).json({ error: 'Failed to register product category'});
      }
       res.json(insertedLocalities);
    }catch(error){
      console.error('Error inserting product categories:', error);
      res.status(500).json({error: 'Internal server error.'})
    }
  }else{
    if(!request.category || !request.state){
        errors.push({ error: 'Failed to register product category'});
    }
    if(errors.length > 0){
        return res.status(400).json(errors);
    }
    const result = await pool.query('INSERT INTO product_categories (category, state) VALUES ($1, $2) RETURNING *', [request.category, request.state]);
    if(result.rows.length === 0){
        return res.status(404).json({ error: 'Failed to register product category'});
    }
    res.json(result.rows[0]);
  }
}

exports.updateOne = async (req, res) =>{
  if(!req.body.category || !req.body.state){
        return res.status(404).json({ error: 'Failed to update product category' });
  }
  const { id } = req.params;
  const { category, state } = req.body;
  const result = await pool.query('UPDATE product_categories SET category = $1, state = $2 WHERE id = $3 RETURNING *', [category, state, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find product category' });
  }
  res.json(result.rows[0]);
}

exports.deleteOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('DELETE FROM product_categories WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find product category' });
  }
  res.json({ message: 'Product category successfully deleted.' });
}

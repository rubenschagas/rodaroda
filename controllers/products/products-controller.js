// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

//exporting the data base configs
const dataBase = require('../../data-base-config/db-config');

const bodyParser = require('body-parser');
const { Pool } = require('pg');

const port = dataBase.dbAppPort;

//Configurating the db connection
const pool = new Pool(dataBase.dbConfig);

exports.getAll = async (req, res) =>{
  const result = await pool.query('SELECT * FROM product');
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find products.' });
  }
  res.json(result.rows);
}

exports.getOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM product WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find product.' });
  }
  res.json(result.rows[0]);
}

exports.postOne = async (req, res) =>{
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
}

exports.updateOne = async (req, res) =>{
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
}

exports.deleteOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('DELETE FROM product WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find product.' });
  }
  res.json({ message: 'Product successfully deleted.' });
}

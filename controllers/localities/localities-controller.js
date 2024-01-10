// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

//exporting the data base configs
const dataBase = require('../../data-base-config/db-config');

const bodyParser = require('body-parser');
const { Pool } = require('pg');

const port = dataBase.dbAppPort;

//Configurating the db connection
const pool = new Pool(dataBase.dbConfig);

exports.getAll = async (req, res) =>{
  const result = await pool.query('SELECT * FROM locality');
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find localities.' });
  }
  res.json(result.rows);
}

exports.getOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM locality WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find locality.' });
  }
  res.json(result.rows[0]);
}

exports.postOne = async (req, res) =>{
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
}

exports.updateOne = async (req, res) =>{
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
}

exports.deleteOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('DELETE FROM locality WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find locality.' });
  }
  res.json({ message: 'Locality successfully deleted.' });
}

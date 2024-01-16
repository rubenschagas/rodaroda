// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

//exporting the data base configs
const dataBase = require('../../data-base-config/db-config');

const bodyParser = require('body-parser');
const { Pool } = require('pg');

const port = dataBase.dbAppPort;

//Configurating the db connection
const pool = new Pool(dataBase.dbConfig);

exports.getAll = async (req, res) =>{
    const result = await pool.query('SELECT * FROM brazilian_states');
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Cannot find brazilian states.' });
    }
    res.json(result.rows);
}

exports.getOne = async (req, res) =>{
   const { id } = req.params;
   const result = await pool.query('SELECT * FROM brazilian_states WHERE id = $1', [id]);
   if (result.rows.length === 0) {
     return res.status(404).json({ error: 'Cannot find brazilian state.' });
   }
   res.json(result.rows[0]);
}

exports.postOne = async (req, res) =>{
   const request = req.body;
   const errors = [];

   if(request.length > 1 || request.length === 1){
     for(const register of request){
       if(!register.uf_code || !register.uf || !register.uf_name || !register.state){
             errors.push({ error: 'Failed to register brazilian state.'});
       }
     }
     if(errors.length > 0){
       return res.status(400).json(errors);
     }
     const promises = request.map(async (register) => {
       const result = await pool.query('INSERT INTO brazilian_states (uf_code, uf, uf_name, state) VALUES ($1, $2, $3, $4) RETURNING *', [register.uf_code, register.uf, register.uf_name, register.state]);
       return result.rows[0];
     });
     try{
       const insertedLocalities = await Promise.all(promises);

       if(insertedLocalities.length === 0){
           return res.status(404).json({ error: 'Failed to register brazilian state.'});
       }
       res.json(insertedLocalities);
     }catch(error){
       console.error('Error inserting brazilian states:', error);
       res.status(500).json({error: 'Internal server error.'})
     }
   }else{
     if(!request.uf_code || !request.uf || !request.uf_name || !request.state){
           errors.push({ error: 'Failed to register brazilian state.'});
     }
     if(errors.length > 0){
       return res.status(400).json(errors);
     }
     const result = await pool.query('INSERT INTO brazilian_states (uf_code, uf, uf_name, state) VALUES ($1, $2, $3, $4) RETURNING *', [request.uf_code, request.uf, request.uf_name, request.state]);
     if(result.rows.length === 0){
         return res.status(404).json({ error: 'Failed to register brazilian state.'});
     }
     res.json(result.rows[0]);
   }
}

exports.updateOne = async (req, res) =>{
  if(!req.body.uf_code || !req.body.uf || !req.body.cnpj || !req.body.uf_name || !req.body.state){
        return res.status(404).json({ error: 'Failed to update brazilian state.' });
  }
  const { id } = req.params;
  const { uf_code, uf, uf_name, state } = req.body;
  const result = await pool.query('UPDATE brazilian_states SET uf_code = $1, uf = $2, uf_name = $3, state = $4 WHERE id = $5 RETURNING *', [uf_code, uf, uf_name, state, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find brazilian_state.' });
  }
  res.json(result.rows[0]);
}

exports.deleteOne = async (req, res) =>{
  const { id } = req.params;
  const result = await pool.query('DELETE FROM brazilian_states WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find brazilian state.' });
  }
  res.json({ message: 'Brazilian state successfully deleted.' });
}

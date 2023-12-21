const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Configuração do pool de conexão com o PostgreSQL
const pool = new Pool({
  host: 'localhost',
  database: 'rodaroda',
  user: 'postgres',
  password: 'postgres',
  port: 5432,
});

// CRUD para localidade
app.get('/localidades', async (req, res) => {
  const result = await pool.query('SELECT * FROM localidade');
  res.json(result.rows);
});

app.post('/localidades', async (req, res) => {
  const { nome, descricao } = req.body;
  const result = await pool.query('INSERT INTO localidade (nome, tipo) VALUES ($1, $2) RETURNING *', [nome, tipo]);
  res.json(result.rows[0]);
});

app.get('/localidades/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM localidade WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'localidade não encontrada' });
  }
  res.json(result.rows[0]);
});

app.put('/localidades/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, tipo } = req.body;
  const result = await pool.query('UPDATE localidade SET nome = $1, tipo = $2 WHERE id = $3 RETURNING *', [nome, descricao, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'localidade não encontrada' });
  }
  res.json(result.rows[0]);
});

app.delete('/localidades/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM localidade WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'localidade não encontrada' });
  }
  res.json({ message: 'localidade excluída com sucesso' });
});

// CRUD para produto
app.get('/produtos', async (req, res) => {
  const result = await pool.query('SELECT * FROM produto');
  res.json(result.rows);
});

app.post('/produtos', async (req, res) => {
  const { nome, descricao } = req.body;
  const result = await pool.query('INSERT INTO produto (nome, descricao) VALUES ($1, $2) RETURNING *', [nome, descricao]);
  res.json(result.rows[0]);
});

app.get('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM produto WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'produto não encontrado' });
  }
  res.json(result.rows[0]);
});

app.put('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  const result = await pool.query('UPDATE produto SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *', [nome, descricao, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'produto não encontrado' });
  }
  res.json(result.rows[0]);
});

app.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM produto WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'produto não encontrado' });
  }
  res.json({ message: 'produto excluído com sucesso' });
});

// CRUD para transportadora
app.get('/transportadoras', async (req, res) => {
  const result = await pool.query('SELECT * FROM transportadora');
  res.json(result.rows);
});

app.post('/transportadoras', async (req, res) => {
  const { nome, contato } = req.body;
  const result = await pool.query('INSERT INTO transportadora (nome, contato) VALUES ($1, $2) RETURNING *', [nome, contato]);
  res.json(result.rows[0]);
});

app.get('/transportadoras/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM transportadora WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'transportadora não encontrado' });
  }
  res.json(result.rows[0]);
});

app.put('/transportadoras/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  const result = await pool.query('UPDATE transportadora SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *', [nome, descricao, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'transportadora não encontrado' });
  }
  res.json(result.rows[0]);
});

app.delete('/transportadoras/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM transportadora WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'transportadora não encontrado' });
  }
  res.json({ message: 'transportadora excluído com sucesso' });
});

// CRUD para veiculo
app.get('/veiculos', async (req, res) => {
  const result = await pool.query('SELECT * FROM veiculo');
  res.json(result.rows);
});

app.post('/veiculos', async (req, res) => {
  const { modelo, placa } = req.body;
  const result = await pool.query('INSERT INTO veiculo (modelo, placa) VALUES ($1, $2) RETURNING *', [modelo, placa]);
  res.json(result.rows[0]);
});

// TODO: Adicione rotas semelhantes para atualização, exclusão e visualização individual para veiculo

// CRUD para viagem
app.get('/viagens', async (req, res) => {
  const result = await pool.query('SELECT * FROM viagem');
  res.json(result.rows);
});

app.post('/viagens', async (req, res) => {
  const { origem_id, destino_id, produto_id, transportadora_id, veiculo_id, data_partida, data_chegada } = req.body;
  const result = await pool.query('INSERT INTO viagem (origem_id, destino_id, produto_id, transportadora_id, veiculo_id, data_partida, data_chegada) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [origem_id, destino_id, produto_id, transportadora_id, veiculo_id, data_partida, data_chegada]);
  res.json(result.rows[0]);
});

// TODO: Adicione rotas semelhantes para atualização, exclusão e visualização individual para viagem

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

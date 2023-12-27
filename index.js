// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

    const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
// TODO: dinamizar a porta
const port = 3000;

app.use(bodyParser.json());

// TODO: modularizar (com PageObject e os mesmos paradigmas dos projetos de automação) e dinamizar as configurações com o banco de dados
// Configuração do pool de conexão com o PostgreSQL
const pool = new Pool({
  host: 'localhost',
  database: 'rodaroda',
  user: 'postgres',
  password: 'postgres',
  port: 5432,
});

// TODO: modularizar (com PageObject e os mesmos paradigmas dos projetos de automação) cada CRUD
// TODO: refatorar de forma que os endpoints suportem um ou mais registros no mesmo payload

// CRUD para localidade
app.get('/localidades', async (req, res) => {
  const result = await pool.query('SELECT * FROM localidade');
  res.json(result.rows);
});

app.post('/localidades', async (req, res) => {
  const { nome, tipo } = req.body;
  const result = await pool.query('INSERT INTO localidade (nome, tipo) VALUES ($1, $2) RETURNING *', [nome, tipo]);
  res.json(result.rows[0]);
});

app.get('/localidades/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM localidade WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Localidade não encontrada.' });
  }
  res.json(result.rows[0]);
});

app.put('/localidades/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, tipo } = req.body;
  const result = await pool.query('UPDATE localidade SET nome = $1, tipo = $2 WHERE id = $3 RETURNING *', [nome, tipo, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Localidade não encontrada.' });
  }
  res.json(result.rows[0]);
});

app.delete('/localidades/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM localidade WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Localidade não encontrada.' });
  }
  res.json({ message: 'Localidade excluída com sucesso.' });
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
    return res.status(404).json({ error: 'Produto não encontrado.' });
  }
  res.json(result.rows[0]);
});

app.put('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  const result = await pool.query('UPDATE produto SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *', [nome, descricao, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Produto não encontrado.' });
  }
  res.json(result.rows[0]);
});

app.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM produto WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Produto não encontrado.' });
  }
  res.json({ message: 'Produto excluído com sucesso.' });
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
    return res.status(404).json({ error: 'Transportadora não encontrada.' });
  }
  res.json(result.rows[0]);
});

app.put('/transportadoras/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  const result = await pool.query('UPDATE transportadora SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *', [nome, descricao, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Transportadora não encontrada.' });
  }
  res.json(result.rows[0]);
});

app.delete('/transportadoras/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM transportadora WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Transportadora não encontrada.' });
  }
  res.json({ message: 'Transportadora excluída com sucesso.' });
});

// CRUD para veículo
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

// TODO: modularizar (com PageObject e os mesmos paradigmas dos projetos de automação) a escuta
// TODO: realizar tratamentos de violações de integridade dos relacionamentos da base de dados de forma que o server não caia quando, por exemplo, deixarmos de enviar um campo não nulo em uma integração
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// TODO: criar um projeto de frontend. Base: https://chat.openai.com/share/e5aa4258-e063-4002-956d-ec6b4fbbbb81
// TODO: modularizar (com PageObject e os mesmos paradigmas dos projetos de automação) e separar os serviços de backend dos submódulos do frontend
// TODO: criar um script de CLI como gateway para informar parâmetros semelhante aos outros projetos de automação
// TODO: migrar os scripts para TypeScript
// TODO: implementar autenticação por token
// TODO: implementar cadastro de usuários
// TODO: implementar criptografia no password

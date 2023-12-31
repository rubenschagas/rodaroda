// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

// Fase 1: New features and technical debits:
// TODO: 1. migrar esta lista de TODOs para um arquivo TODO.md
// TODO: 2. modularizar (com PageObject e os mesmos paradigmas dos projetos de automação) cada CRUD e a escuta do servidor
// TODO: 3. refatorar de forma que os endpoints suportem um ou mais registros no mesmo payload, quando aplicável
// TODO: 4. realizar tratamentos de violações de integridade dos relacionamentos da base de dados de forma que o server não caia quando, por exemplo, deixarmos de enviar um campo não nulo em uma integração

// Fase 2: Standards:
// TODO: 5. definir, documentar e implementar: Design Pattern, Code Formatters, Testing Framework (e.g. Cypress) for the frontend, Standardizations and Technical Guidelines, The definition of standards (for variables, files, and so on), Helper Classes, Helper Functions, use of JDoc, etc.
// TODO: 6. migrar os scripts para TypeScript

// Fase 3: Autenticação:
// TODO: 7. implementar autenticação por token
// TODO: 8. implementar cadastro de usuários
// TODO: 9. implementar hash no password
// TODO: 10. implementar comms com o protocolo https

// Fase 4: Frontend:
// TODO: 11. criar um projeto de frontend. Desenhar telas e fluxos. Se basear em: https://chat.openai.com/share/e5aa4258-e063-4002-956d-ec6b4fbbbb81
// TODO: 12. separar os serviços de backend dos submódulos do frontend

// Fase 5: CI/CD:
// TODO: 13. estudar a criação de uma imagem Docker para ser publicada em um Docker Registry (no Docker Hub?) contendo a aplicação, banco de dados, base de dados, um SO Alpine, os testes integrados de API e a publicação do respectivo relatório, assim como as outras dependências técnicas
// TODO: 14. estudar o uso de pipelines CI, CD (utilizando uma imagem Jenkins?) e publicação em Nuvem (GCP?/AWS? com cotas grátis)

// Fase 6: Melhorias de aplicação e regras de negócio:
// TODO: 15. estudar sobre restrições de entidades por parâmetros (criando tabelas relacionadas para tal):
//   criar categorias de produtos e associa-las aos produtos;
//   criar tabelas com todos os estados e cidades do Brasil e associa-las às localidades;
//   criar tipos de veículos e associa-las aos veículos;
//   criar uma frota de veículo e associá-la a uma transportadora;
//   restrição de um único veículo por vez reservado para uma única viagem;
//   geolocalização (utilizando um bd postgis) para cálculo de rota via API do Google, e;
//   cálculo de duração da viagem;
//   docas de carregamento e descarregamento nas localidades (dias de funcionamento?);
//   restrições de localidade (por exemplo, recorte de ZMRV) por uma transportadora/veículo;
//   cálculo de frete utilizando uma tabela por distancia);
//   etc.

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
app.get('/localidades', async (req, res) => {
  const result = await pool.query('SELECT * FROM localidade');
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Localidades não encontradas.' });
  }
  res.json(result.rows);
});

app.post('/localidades', async (req, res) => {
   if(!req.body.nome || !req.body.tipo){
      return res.status(404).json({ error: 'Falha ao cadastrar localidade.' });
   }
  const { nome, tipo } = req.body;
  const result = await pool.query('INSERT INTO localidade (nome, tipo) VALUES ($1, $2) RETURNING *', [nome, tipo]);
   if (result.rows.length === 0) {
     return res.status(404).json({ error: 'Falha ao cadastrar localidade.' });
   }
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
  if(!req.body.nome || !req.body.tipo){
        return res.status(404).json({ error: 'Falha ao atualizar localidade.' });
  }
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
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Produtos não encontrados.' });
  }
  res.json(result.rows);
});

app.post('/produtos', async (req, res) => {
  if(!req.body.nome || !req.body.descricao){
        return res.status(404).json({ error: 'Falha ao cadastrar produto.' });
  }
  const { nome, descricao } = req.body;
  const result = await pool.query('INSERT INTO produto (nome, descricao) VALUES ($1, $2) RETURNING *', [nome, descricao]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Falha ao cadastrar produto.' });
  }
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
  if(!req.body.nome || !req.body.descricao){
    return res.status(404).json({ error: 'Falha ao atualizar produto.' });
  }
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
   if (result.rows.length === 0) {
     return res.status(404).json({ error: 'Transportadoras não encontradas.' });
   }
  res.json(result.rows);
});

app.post('/transportadoras', async (req, res) => {
  if(!req.body.nome || !req.body.contato){
    return res.status(404).json({ error: 'Falha ao cadastrar transportadora.' });
  }
  const { nome, contato } = req.body;
  const result = await pool.query('INSERT INTO transportadora (nome, contato) VALUES ($1, $2) RETURNING *', [nome, contato]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Falha ao cadastrar transportadora.' });
  }
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
  if(!req.body.nome || !req.body.contato){
    return res.status(404).json({ error: 'Falha ao atualizar transportadora.' });
  }
  const { id } = req.params;
  const { nome, contato } = req.body;
  const result = await pool.query('UPDATE transportadora SET nome = $1, contato = $2 WHERE id = $3 RETURNING *', [nome, contato, id]);
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
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Veiculos não encontrados.' });
  }
  res.json(result.rows);
});

app.post('/veiculos', async (req, res) => {
  if(!req.body.nome || !req.body.modelo || !req.body.placa){
    return res.status(404).json({ error: 'Falha ao cadastrar veiculo.' });
  }
  const { nome, modelo, placa } = req.body;
  const result = await pool.query('INSERT INTO veiculo (nome, modelo, placa) VALUES ($1, $2, $3) RETURNING *', [nome, modelo, placa]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Falha ao cadastrar veiculo.' });
  }
  res.json(result.rows[0]);
});

app.get('/veiculos/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM veiculo WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Veículo não encontrado.' });
  }
  res.json(result.rows[0]);
});

app.put('/veiculos/:id', async (req, res) => {
  if(!req.body.nome || !req.body.modelo || !req.body.placa){
    return res.status(404).json({ error: 'Falha ao atualizar veiculo.' });
  }
  const { id } = req.params;
  const { nome, modelo, placa } = req.body;
  const result = await pool.query('UPDATE veiculo SET nome = $1, modelo = $2, placa = $3 WHERE id = $4 RETURNING *', [nome, modelo, placa, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Veículo não encontrado.' });
  }
  res.json(result.rows[0]);
});

app.delete('/veiculos/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM veiculo WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Veículo não encontrada.' });
  }
  res.json({ message: 'Veículo excluído com sucesso.' });
});

// CRUD para viagem
app.get('/viagens', async (req, res) => {
  const result = await pool.query('SELECT * FROM viagem');
  if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Viagens não encontradas.' });
  }
  res.json(result.rows);
});

app.post('/viagens', async (req, res) => {
  if(!req.body.origem_id || !req.body.destino_id || !req.body.produto_id || !req.body.transportadora_id || !req.body.veiculo_id || !req.body.data_partida || !req.body.data_chegada){
      return res.status(404).json({ error: 'Falha ao cadastrar viagem.' });
  }
  const { origem_id, destino_id, produto_id, transportadora_id, veiculo_id, data_partida, data_chegada } = req.body;
  const result = await pool.query('INSERT INTO viagem (origem_id, destino_id, produto_id, transportadora_id, veiculo_id, data_partida, data_chegada) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
  [origem_id, destino_id, produto_id, transportadora_id, veiculo_id, data_partida, data_chegada]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Falha ao cadastrar viagem.' });
    }
  res.json(result.rows[0]);
});

app.get('/viagens/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM viagem WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Viagem não encontrada.' });
  }
  res.json(result.rows[0]);
});

app.put('/viagens/:id', async (req, res) => {
  if(!req.body.origem_id || !req.body.destino_id || !req.body.produto_id || !req.body.transportadora_id || !req.body.veiculo_id || !req.body.data_partida || !req.body.data_chegada){
    return res.status(404).json({ error: 'Falha ao atualizar viagem.' });
  }
  const { id } = req.params;
  const { origem_id, destino_id, produto_id, transportadora_id, veiculo_id, data_partida, data_chegada } = req.body;
  const result = await pool.query('UPDATE viagem SET origem_id = $1, destino_id = $2, produto_id = $3, transportadora_id = $4, veiculo_id = $5, data_partida = $6, data_chegada = $7  WHERE id = $8 RETURNING *',
  [origem_id, destino_id, produto_id, transportadora_id, veiculo_id, data_partida, data_chegada, id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Viagem não encontrada.' });
  }
  res.json(result.rows[0]);
});

app.delete('/viagens/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM viagem WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Viagem não encontrada.' });
  }
  res.json({ message: 'Viagem excluída com sucesso.' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

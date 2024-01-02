// noinspection JSStringConcatenationToES6Template,SpellCheckingInspection

// TODOs list
//
// Fase 1: Creating the automated Devop infrastructure (database, app, endpoints, automated API testing, html report, CLI, etc.) - DONE
//
// Fase 2: New features and technical debits:
// TODO: 1. manter o README.md constantemente atualizado!
// TODO: 2. migrar esta lista de TODOs para um arquivo TODO.md
// TODO: 3. se abituar a criar branches separadas por features/melhorias, criando PRs para a main
// TODO: 4. traduzir todo o projeto para o Inglês, incluindo a padronização de código, endpoints, collection, etc.
// TODO: 5. modularizar (com os mesmos paradigmas dos projetos de automação) cada CRUD e a escuta do servidor
// TODO: 6. resolver os problemas de código do projeto (via Inspect Code), pesquisando
// TODO: 7. refatorar de forma que os endpoints suportem um ou mais registros no mesmo payload, quando aplicável (e.g. in post method)
// TODO: 8. realizar tratamentos de violações de integridade dos relacionamentos da base de dados de forma que o server não caia quando, por exemplo, deixarmos de enviar um campo não nulo em uma integração
// TODO: 9. criar uma entidade de pedidos, com relacionamentos com as existentes, alterando a estrutura de automação de criação de banco de dados (Ansible playbooks) e incrementando a Postman collection

// Fase 3: Standards:
// TODO: 10. definir, documentar e implementar:
//   Design Pattern;
//   Code Formatters (ESLint, como nos projetos de automação);
//   Standardizations and Technical Guidelines (como nos README.md das automações);
//   The definition of standards (camelCase for variables, kabab-case for files, and so on);
//   Helper Classes, Helper Functions;
//   use of JDoc in functions;
//   etc.
// TODO: 11. migrar os scripts para TypeScript
// TODO: 12. pesquisar implementar uma tabela de controle de versionamento de banco de dados de forma que, a cada atualização na estrutura de base de dados, cresça um id de versão, e estas atualizações de versão sejam por queries PostgreSQL

// Fase 4: Autenticação:
// TODO: 13. implementar autenticação por token nas APIs
// TODO: 14. implementar cadastro de usuários
// TODO: 15. implementar hash no password
// TODO: 16. implementar perfis de acesso
// TODO: 17. implementar comms com o protocolo https

// Fase 5: Frontend:
// TODO: 18. criar um projeto de frontend. Desenhar telas e fluxos, incluindo uma tela de pedidos em que um analista de logística trabalharia.
//   Se basear em: https://chat.openai.com/share/e5aa4258-e063-4002-956d-ec6b4fbbbb81
// TODO: 19. separar os serviços de backend dos submódulos do frontend
// TODO: 20. implementar um testing Framework (e.g. Cypress) eventually for the frontend

// Fase 6: DevOps CI/CD:
// TODO: 21. estudar a criação de uma imagem Docker para ser publicada em um Docker Registry (no Docker Hub?) contendo a aplicação, banco de dados, base de dados, um SO Alpine, os testes integrados de API e a publicação do respectivo relatório, assim como as outras dependências técnicas
// TODO: 22. estudar o uso de pipelines CI, CD (utilizando uma imagem Jenkins?) e publicação em Nuvem (GCP?/AWS? com cotas grátis)

// Fase 7: SRE Observality:
// TODO: 23. implementar um sistema de logs de aplicação em arquivo
// TODO: 24. Implementar server e agent de tests de ambiente (e.g. Zabbix, log elastich search, etc.) para ficar testando a disponibilidade e saúde da aplicação, banco de dados, portas, etc.

// Fase 8: Melhorias de aplicação e regras de negócio:
// TODO: 25. estudar sobre restrições de entidades por parâmetros (criando tabelas relacionadas para tal):
//   criar uma tabela de placas e respectivo relacionamento com veículo
//   criar tipos de veículos e associa-las aos veículos;
//   criar uma frota de veículo e associá-la a uma transportadora;
//   criar categorias de produtos e associa-las aos produtos;
//   restrição de um único veículo por vez reservado para uma única viagem;
//   criar tabelas com todos os estados e cidades do Brasil e associa-las às localidades;
//   docas de carregamento e descarregamento nas localidades (dias de funcionamento?);
//   restrições de localidade (por exemplo, recorte de ZMRV) por uma transportadora/veículo;
//   criar um tabela de papéis/tipos logísticos de localidade e associá-los com os registros de localidade existentes
//   cálculo de frete utilizando uma tabela por distancia);
//   geolocalização (utilizando um bd postgis) para cálculo de rota via API do Google, e;
//   cálculo de duração da viagem;
//   introduzir status de viagem;
//   criar uma tela para monitoramento de status de viagens;
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
app.get('/localities', async (req, res) => {
  const result = await pool.query('SELECT * FROM locality');
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Cannot find localities.' });
  }
  res.json(result.rows);
});

app.post('/localities', async (req, res) => {
   if(!req.body.name || !req.body.type){
      return res.status(404).json({ error: 'Failed to register locality.' });
   }
  const { name, type } = req.body;
  const result = await pool.query('INSERT INTO locality (name, type) VALUES ($1, $2) RETURNING *', [name, type]);
   if (result.rows.length === 0) {
     return res.status(404).json({ error: 'Failed to register locality.' });
   }
  res.json(result.rows[0]);
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
  if(!req.body.name || !req.body.description){
        return res.status(404).json({ error: 'Failed to register product.' });
  }
  const { name, description } = req.body;
  const result = await pool.query('INSERT INTO produto (name, description) VALUES ($1, $2) RETURNING *', [name, description]);
  if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Failed to register product.' });
    }
  res.json(result.rows[0]);
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
  if(!req.body.name || !req.body.contact){
    return res.status(404).json({ error: 'Failed to register carrier.' });
  }
  const { name, contact } = req.body;
  const result = await pool.query('INSERT INTO carrier (name, contact) VALUES ($1, $2) RETURNING *', [name, contact]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Failed to register carrier.' });
  }
  res.json(result.rows[0]);
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
  if(!req.body.name || !req.body.model || !req.body.license_plate){
    return res.status(404).json({ error: 'Failed to register vehicle.' });
  }
  const { name, model, license_plate } = req.body;
  const result = await pool.query('INSERT INTO vehicle (name, model, license_plate) VALUES ($1, $2, $3) RETURNING *', [name, model, license_plate]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Failed to register vehicle.' });
  }
  res.json(result.rows[0]);
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
  const { origin_id, destination_id, product_id, carrier_idr, vehicle_id, leaving_date, arrival_date } = req.body;
  const result = await pool.query('INSERT INTO viagem (origin_id, destination_id, product_id, carrier_id, vehicle_id, leaving_date, arrival_Date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
  [origin_id, destination_id, product_id, carrier_idr, vehicle_id, leaving_date, arrival_date]);
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
